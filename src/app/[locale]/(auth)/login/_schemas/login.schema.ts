import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "usernameRequired"),

  password: z
    .string()
    .min(1, "passwordRequired"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
