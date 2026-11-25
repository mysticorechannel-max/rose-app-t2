import type { CartErrorCode } from "@/shared/lib/types/cart";

export type CartMessageKey = "sessionExpired" | "storageError" | "addError";

export type CartTranslate = (key: CartMessageKey) => string;

export class CartError extends Error {
  readonly code: CartErrorCode;
  readonly backendMessage?: string;

  constructor(code: CartErrorCode, backendMessage?: string) {
    super(backendMessage ?? code);
    this.name = "CartError";
    this.code = code;
    this.backendMessage = backendMessage;
  }
}

export class GuestCartStorageError extends Error {
  constructor(message = "Guest cart storage is unavailable", options?: { cause?: unknown }) {
    super(message, options);
    this.name = "GuestCartStorageError";
  }
}

export function getCartErrorMessage(error: CartError, t: CartTranslate): string {
  if (error.code === "unauthenticated") return t("sessionExpired");
  if (error.code === "storageUnavailable") return t("storageError");

  const backendMessage = error.backendMessage?.trim();

  return backendMessage ? backendMessage : t("addError");
}
