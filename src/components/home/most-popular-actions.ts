"use server";

import { fetchMostPopularProducts } from "@/lib/api";
import type { Product } from "@/types/product";

const MOST_POPULAR_LIMIT = 12;

// Each tab change calls this action, triggering a fresh backend request
// for exactly the 12 products of the selected occasion.
export async function getMostPopularByOccasion(occasionId: string): Promise<Product[]> {
    // Empty id = tab with no backend occasion; omit it so the API returns the
    // general most-popular list instead of rejecting an unknown id with 400.
    return fetchMostPopularProducts(occasionId || undefined, MOST_POPULAR_LIMIT);
}
