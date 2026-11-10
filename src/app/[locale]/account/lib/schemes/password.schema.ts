import { z } from "zod";

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "required"),
    newPassword: z.string().min(1, "required").min(8, "passwordTooShort"),
    confirmPassword: z.string().min(1, "required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "passwordMismatch",
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    path: ["newPassword"],
    error: "passwordSameAsOld",
  });

export type PasswordFields = z.infer<typeof passwordSchema>;