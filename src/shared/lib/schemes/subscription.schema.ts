import { z } from "zod";

export const subscriptionSchema = z.object({
  email: z.string().min(1).email(),
});

export type SubscriptionFields = z.infer<typeof subscriptionSchema>;
