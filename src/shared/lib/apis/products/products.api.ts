import type { Product } from "@/types/product";

/**
 * Fetch most popular products from the local Route Handler.
 * The handler proxies the backend using the server-only API_URL,
 * so no API host is exposed to the browser.
 */
export async function getMostPopularProducts(
    occasionId: string,
    limit: number
): Promise<Product[]> {
    const params = new URLSearchParams({
        occasionId,
        limit: String(limit),
    });

    const response = await fetch(`/api/most-popular?${params.toString()}`, {
        headers: { Accept: "application/json" },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch most popular products");
    }

    return response.json();
}
