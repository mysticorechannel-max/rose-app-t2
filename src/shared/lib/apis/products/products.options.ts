import { ProductSearchParams } from "../../types/product";

export function getProductOptions(params: ProductSearchParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.append("search", params.search);
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params.category) searchParams.append("category", params.category);
  if (params.minPrice !== undefined) searchParams.append("minPrice", params.minPrice.toString());
  if (params.maxPrice !== undefined) searchParams.append("maxPrice", params.maxPrice.toString());

  return searchParams;
}
