import { GUEST_CART_STORAGE_KEY } from "@/shared/lib/constants/cart.constant";
import { GuestCartStorageError } from "@/shared/lib/errors/cart-error";
import { guestCartSchema, type GuestCart } from "@/shared/lib/schemes/cart.schema";

type ReadableStorage = Pick<Storage, "getItem">;
type WritableStorage = Pick<Storage, "getItem" | "setItem">;

export function parseGuestCart(raw: string | null): GuestCart {
  if (raw === null) return [];

  try {
    const result = guestCartSchema.safeParse(JSON.parse(raw));

    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

export function serializeGuestCart(cart: GuestCart): string {
  return JSON.stringify(cart);
}

export function addGuestCartItem(cart: GuestCart, productId: string, quantity: number): GuestCart {
  const hasItem = cart.some((item) => item.productId === productId);

  // Append new products at the end
  if (!hasItem) return [...cart, { productId, quantity }];

  // Increment the existing entry in place, keeping order and length
  return cart.map((item) =>
    item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
  );
}

export function readGuestCart(storage: ReadableStorage): GuestCart {
  try {
    return parseGuestCart(storage.getItem(GUEST_CART_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function writeGuestCart(storage: WritableStorage, cart: GuestCart): void {
  try {
    storage.setItem(GUEST_CART_STORAGE_KEY, serializeGuestCart(cart));
  } catch (error) {
    throw new GuestCartStorageError(undefined, { cause: error });
  }
}

export function addToGuestCart(
  storage: WritableStorage,
  productId: string,
  quantity: number
): GuestCart {
  const nextCart = addGuestCartItem(readGuestCart(storage), productId, quantity);

  writeGuestCart(storage, nextCart);

  return nextCart;
}
