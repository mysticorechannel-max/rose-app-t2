import "server-only";
import type { ApiResponse } from "@/types/product";
import type { GetReviewsParams, ReviewsResult, ReviewsPayload } from "../types/review";
const REVIEWS_PATH = "/api/reviews";
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export async function getReviews({
  productId,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
}: GetReviewsParams): Promise<ReviewsResult> {
  const baseUrl = process.env.API_URL;
  if (!baseUrl) return { ok: false };

  const url = new URL(`${baseUrl}${REVIEWS_PATH}`);
  url.searchParams.set("productId", productId);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  try {
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) return { ok: false };

    const body = (await response.json()) as ApiResponse<ReviewsPayload>;
    return { ok: true, payload: body.payload };
  } catch {
    // Network failure: the caller shows the error state.
    return { ok: false };
  }
}