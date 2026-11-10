import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "required"),
  lastName: z.string().trim().min(1, "required"),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || isValidPhoneNumber(value), {
      error: "invalidPhone",
    }),
});

export type ProfileFields = z.infer<typeof profileSchema>;