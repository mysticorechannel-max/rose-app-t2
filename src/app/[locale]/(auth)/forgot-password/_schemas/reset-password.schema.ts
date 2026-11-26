import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "passwordRequired")
      .min(8, "passwordMinLength"),

    confirmPassword: z
      .string()
      .min(1, "confirmPasswordRequired"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "passwordsMismatch",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<
  typeof resetPasswordSchema
>;
