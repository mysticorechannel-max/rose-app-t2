import { z } from "zod";

const MIN_RATING = 0.5;

export const reviewSchema = z.object({
  rating: z.number().min(MIN_RATING, "ratingRequired"),
  headline: z.string().trim().min(1, "required"),
  content: z.string().trim().min(1, "required"),
});

export type ReviewFields = z.infer<typeof reviewSchema>;
