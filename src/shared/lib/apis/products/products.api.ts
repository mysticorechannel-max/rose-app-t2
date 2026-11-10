import type { ProductResponse, ProductSearchParams } from "@/shared/lib/types/product";
import { PRODUCT_ENDPOINTS } from "./products.endpoint";
import { getProductOptions } from "./products.options";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Search for products
 */
export async function searchProducts(params: ProductSearchParams): Promise<ProductResponse> {
  const searchParams = getProductOptions(params);

  const response = await fetch(`/api/products/search?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  return response.json();
}

/**
 * Get product suggestions (for search dropdown)
 */
export async function getProductSuggestions(limit: number = 5): Promise<ProductResponse> {
  const searchParams = getProductOptions({
    limit,
    sortBy: "mostPopular",
  });

  const response = await fetch(`/api/products/search?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  return response.json();
}
