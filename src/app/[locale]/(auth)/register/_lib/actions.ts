
import {
  ApiError,
  confirmEmailVerification,
  registerUser,
  sendEmailVerification,
} from "./auth";

import {
  emailSchema,
  otpSchema,
  passwordSchema,
  type ProfileValues,
  profileSchema,
} from "./schemas";

// Server actions return a result object instead of throwing: in production Next.js
// masks thrown error messages, so the UI could not tell "wrong code" from "network".
// `error` is a key under `auth.register.errors.*`.
export type ActionError = "network" | "invalidCode" | "emailTaken" | "generic";
export type ActionResult = { ok: true } | { ok: false; error: ActionError };

const OK: ActionResult = { ok: true };
const fail = (error: ActionError): ActionResult => ({ ok: false, error });

function toError(e: unknown): ActionResult {
  if (!(e instanceof ApiError)) return fail("generic");
  if (e.httpStatus === 0) return fail("network");
  const msg = e.message.toLowerCase();
  if (msg.includes("otp") || msg.includes("code") || msg.includes("expired")) return fail("invalidCode");
  if (e.httpStatus === 409 || msg.includes("exist") || msg.includes("already")) return fail("emailTaken");
  return fail("generic");
}

/** Step 1 and "Send a new code". */
export async function sendEmailVerificationAction(email: string): Promise<ActionResult> {
  // Server actions are public endpoints: never trust the client, validate again here.
  const parsed = emailSchema.safeParse({ email });
  if (!parsed.success) return fail("generic");

  try {
    await sendEmailVerification(parsed.data.email);
    return OK;
  } catch (e) {
    return toError(e);
  }
}

/** Step 2: verify the OTP. */
export async function confirmEmailVerificationAction(
  email: string,
  code: string,
): Promise<ActionResult> {
  const parsedEmail = emailSchema.safeParse({ email });
  const parsedCode = otpSchema.safeParse({ code });
  if (!parsedEmail.success || !parsedCode.success) return fail("invalidCode");

  try {
    await confirmEmailVerification(parsedEmail.data.email, parsedCode.data.code);
    return OK;
  } catch (e) {
    return toError(e);
  }
}

/** Step 4: create the account. `phone` is validated but not sent (not in the Swagger body). */
export async function registerAction(input: {
  email: string;
  profile: ProfileValues;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  const email = emailSchema.safeParse({ email: input.email });
  const profile = profileSchema.safeParse(input.profile);
  const passwords = passwordSchema.safeParse({
    password: input.password,
    confirmPassword: input.confirmPassword,
  });
  if (!email.success || !profile.success || !passwords.success) return fail("generic");

  try {
    await registerUser({
      email: email.data.email,
      username: profile.data.username,
      firstName: profile.data.firstName,
      lastName: profile.data.lastName,
      gender: profile.data.gender,
      password: passwords.data.password,
      confirmPassword: passwords.data.confirmPassword,
    });
    return OK;
  } catch (e) {
    return toError(e);
  }
}
