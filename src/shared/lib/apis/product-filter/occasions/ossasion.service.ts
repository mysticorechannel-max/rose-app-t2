import { OccasionsResponse } from "@/shared/lib/types/product-filter/ossasion";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type GetOccasionsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getOccasions({
  page = 1,
  limit = 20,
  search,
}: GetOccasionsParams = {}): Promise<OccasionsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  const response = await fetch(
    `${API_URL}/api/occasions?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch occasions");
  }

  const result: OccasionsResponse = await response.json();

  if (!result.status) {
    throw new Error("Could not load occasions");
  }

  return result;
}
