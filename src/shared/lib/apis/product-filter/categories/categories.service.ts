import { CategoriesResponse } from "@/shared/lib/types/product-filter/categories";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type GetCategoriesParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getCategories({
  page = 1,
  limit = 20,
  search,
}: GetCategoriesParams = {}): Promise<CategoriesResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  const response = await fetch(
    `${API_URL}/api/categories?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result: CategoriesResponse = await response.json();

  if (!result.status) {
    throw new Error("Could not load categories");
  }

  return result;
}
