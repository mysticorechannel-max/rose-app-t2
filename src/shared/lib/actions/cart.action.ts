"use server";

import { CART_ENDPOINTS } from "@/shared/lib/apis/cart/cart.endpoint";
import { addToCartSchema, type AddToCartInput } from "@/shared/lib/schemes/cart.schema";
import { getAccessToken } from "@/shared/lib/server/access-token";
import type { CartActionResult, CartErrorCode } from "@/shared/lib/types/cart";

function toErrorCode(status: number): CartErrorCode {
  if (status === 401) return "unauthenticated";
  if (status === 400 || status === 422) return "badRequest";
  return "unknown";
}

// Reads `message` from an error body without trusting its shape
async function readErrorMessage(response: Response): Promise<string | undefined> {
  try {
    const body: unknown = await response.json();

    if (typeof body === "object" && body !== null && "message" in body) {
      const { message } = body;
      if (typeof message === "string" && message.trim()) return message;
    }
  } catch {
    // Empty or non-JSON body: no message to show
  }

  return undefined;
}

// Logged-in add to cart. The token stays on the server.
export async function addToCartAction(input: AddToCartInput): Promise<CartActionResult> {
  const parsed = addToCartSchema.safeParse(input);
  if (!parsed.success) return { ok: false, code: "badRequest" };

  const token = await getAccessToken();
  if (!token) return { ok: false, code: "unauthenticated" };

  const baseUrl = process.env.API_URL;
  if (!baseUrl) return { ok: false, code: "notConfigured" };

  let response: Response;

  try {
    response = await fetch(`${baseUrl}${CART_ENDPOINTS.ADD}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });
  } catch {
    return { ok: false, code: "network" };
  }

  if (response.ok) return { ok: true };

  return {
    ok: false,
    code: toErrorCode(response.status),
    message: await readErrorMessage(response),
  };
}
