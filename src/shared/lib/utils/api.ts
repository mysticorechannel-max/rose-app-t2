import "server-only";

import { isNewProduct } from "@/shared/lib/utils/product";
import type {
    ApiResponse,
    Occasion,
    PaginatedPayload,
    Product,
} from "@/types/product";

// Server-only API host. Never exposed to the browser.
const API_BASE_URL = process.env.API_URL;

type QueryValue = string | number | undefined;

function buildUrl(path: string, query: Record<string, QueryValue> = {}) {
    if (!API_BASE_URL) {
        throw new Error("API_URL environment variable is not set");
    }

    const url = new URL(`${API_BASE_URL}${path}`);

    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    }

    return url.toString();
}

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        throw new Error(`Request failed (${response.status}) for ${url}`);
    }

    const body = (await response.json()) as ApiResponse<T>;

    return body.payload;
}

// Tags each product with a server-computed "isNew" flag so components never
// call Date.now() during render (which breaks purity and hydration).
function withNewFlag(products: Product[]): Product[] {
    const nowMs = Date.now();
    return products.map((product) => ({
        ...product,
        isNew: isNewProduct(product.createdAt, nowMs),
    }));
}

export async function fetchBestSellingProducts(limit = 10): Promise<Product[]> {
    const url = buildUrl("/products", {
        sortBy: "bestSelling",
        sortOrder: "desc",
        limit,
    });
    const payload = await fetchJson<PaginatedPayload<Product>>(url);

    return withNewFlag(payload.data);
}

export async function fetchMostPopularProducts(
    occasionId?: string,
    limit = 12
): Promise<Product[]> {
    const url = buildUrl("/products", {
        sortBy: "mostPopular",
        sortOrder: "desc",
        occasionId,
        limit,
    });
    const payload = await fetchJson<PaginatedPayload<Product>>(url);

    return withNewFlag(payload.data);
}

export async function fetchOccasions(limit = 4): Promise<Occasion[]> {
    const url = buildUrl("/occasions", { limit });
    const payload = await fetchJson<PaginatedPayload<Occasion>>(url);

    return payload.data;
}
