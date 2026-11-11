import { z } from "zod";

// Error messages are translation keys under `auth.register.validation.*`.
// Components resolve them with t(error.message), so they are bilingual.

export const emailSchema = z.object({
  email: z.string().min(1, "emailRequired").email("emailInvalid"),
});

export const otpSchema = z.object({
  code: z.string().length(6, "otpLength").regex(/^\d{6}$/, "otpDigits"),
});

export const profileSchema = z.object({
  firstName: z.string().trim().min(2, "firstNameRequired"),
  lastName: z.string().trim().min(2, "lastNameRequired"),
  username: z
    .string()
    .trim()
    .min(3, "usernameMin")
    .regex(/^[a-zA-Z0-9_.]+$/, "usernameChars"),
  phoneCode: z.string(),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{7,15}$/.test(v), "phoneInvalid"),
  gender: z.enum(["MALE", "FEMALE"], { message: "genderRequired" }),
});

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "passwordMin")
      .regex(/[a-z]/, "passwordLower")
      .regex(/[A-Z]/, "passwordUpper")
      .regex(/\d/, "passwordNumber")
      .regex(/[^A-Za-z0-9]/, "passwordSpecial"),
    confirmPassword: z.string().min(1, "confirmRequired"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwordMismatch",
  });

export type EmailValues = z.infer<typeof emailSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type PasswordValues = z.infer<typeof passwordSchema>;
