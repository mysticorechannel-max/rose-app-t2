import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "required"),
  lastName: z.string().trim().min(1, "required"),
  email: z.email("invalidEmail"),
  phone: z
  .string()
  .min(1, "required")
  .refine((value) => isValidPhoneNumber(value), { error: "invalidPhone" }),
  gender: z.enum(["male", "female"], { error: "required" }),
  
});

export type ProfileFields = z.infer<typeof profileSchema>;