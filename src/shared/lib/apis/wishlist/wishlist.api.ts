
import { WISHLIST_ENDPOINTS } from "./wishlist.endpoint";
import type { WishlistResponse } from "@/shared/lib/types/wishlist/wishlist";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://rose-app.elevate-bootcamp.cloud";

function getAuthHeaders(token: string): HeadersInit {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}


async function wishlistRequest<T>(
  endpoint: string,
  method: "GET" | "DELETE",
  token: string
): Promise<T> {
  if (!BASE_URL) {
    throw new Error("API URL is not configured");
  }

  if (!token) {
    throw new Error("You must be logged in to access your wishlist");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: getAuthHeaders(token),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || "Wishlist request failed");
  }

  return result as T;
}

export function getWishlist(token: string) {
  return wishlistRequest<WishlistResponse>(
    WISHLIST_ENDPOINTS.GET_ALL,
    "GET",
    token
  );
}

export function removeWishlistItem(id: string, token: string) {
  return wishlistRequest<WishlistResponse>(
    WISHLIST_ENDPOINTS.DELETE_ITEM(id),
    "DELETE",
    token
  );
}

export function clearWishlist(token: string) {
  return wishlistRequest<WishlistResponse>(
    WISHLIST_ENDPOINTS.CLEAR_ALL,
    "DELETE",
    token
  );
}
