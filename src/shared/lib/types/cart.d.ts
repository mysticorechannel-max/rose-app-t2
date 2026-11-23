export type CartErrorCode =
  "notConfigured" | "unauthenticated" | "network" | "badRequest" | "storageUnavailable" | "unknown";

export type CartActionResult = { ok: true } | { ok: false; code: CartErrorCode; message?: string };
