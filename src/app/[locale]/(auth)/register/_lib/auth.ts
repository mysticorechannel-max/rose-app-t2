
// Server-only client for the Rose App auth endpoints (Swagger: /api-docs).
// It runs on the server (called from server actions), so the backend URL is never
// shipped to the browser and CORS does not apply.
// Every response uses the envelope { status, code, message, payload }.

const BASE_URL = process.env.API_URL ?? "https://rose-app.elevate-bootcamp.cloud";

export type ApiEnvelope<T> = {
  status: boolean;
  code: number;
  message: string;
  payload: T;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public httpStatus: number,
    public code?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function post<TBody, TPayload>(path: string, body: TBody): Promise<ApiEnvelope<TPayload>> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new ApiError("network", 0);
  }

  const json = (await res.json().catch(() => null)) as ApiEnvelope<TPayload> | null;

  if (!res.ok || (json && json.status === false)) {
    throw new ApiError(json?.message ?? "unknown", res.status, json?.code);
  }
  return json as ApiEnvelope<TPayload>;
}

export type Gender = "MALE" | "FEMALE";

export type RegisterBody = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  gender: Gender;
};

/** Step 1: send OTP. In development the payload may include the code. */
export const sendEmailVerification = (email: string) =>
  post<{ email: string }, { message?: string; code?: string }>(
    "/api/auth/send-email-verification",
    { email },
  );

/** Step 2: confirm OTP. Email is then marked verified for registration. */
export const confirmEmailVerification = (email: string, code: string) =>
  post<{ email: string; code: string }, unknown>("/api/auth/confirm-email-verification", {
    email,
    code,
  });

/** Step 4: create the account. Requires a verified email. */
export const registerUser = (body: RegisterBody) =>
  post<RegisterBody, { user: unknown; token: string }>("/api/auth/register", body);
