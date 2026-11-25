import type { PaginatedPayload } from "@/types/product";

export interface ReviewUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface ReviewProduct {
  id: string;
  title: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  headline: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
  product: ReviewProduct;
}

export type ReviewsPayload = PaginatedPayload<Review>;

export interface GetReviewsParams {
  productId: string;
  page?: number;
  limit?: number;
}

export type ReviewsResult = { ok: true; payload: ReviewsPayload } | { ok: false };

export interface AddReviewBody {
  productId: string;
  headline: string;
  content: string;
  rating: number;
}