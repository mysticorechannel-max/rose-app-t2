import { z } from "zod";

export const guestCartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

// A valid guest cart has at most one entry per productId
export const guestCartSchema = z
  .array(guestCartItemSchema)
  .refine((items) => new Set(items.map((item) => item.productId)).size === items.length);

// Same { productId, quantity } shape as POST /cart
export const addToCartSchema = guestCartItemSchema;

export type GuestCartItem = z.infer<typeof guestCartItemSchema>;
export type GuestCart = z.infer<typeof guestCartSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
