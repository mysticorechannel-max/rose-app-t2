import type {
    ApiResponse,
    Occasion,
    PaginatedPayload,
    Product,
} from "@/types/product";

// Falls back to the public API host when no env override is provided.
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "https://rose-app.elevate-bootcamp.cloud/api";

type QueryValue = string | number | undefined;

function buildUrl(path: string, query: Record<string, QueryValue> = {}) {
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

export async function fetchBestSellingProducts(limit = 10): Promise<Product[]> {
    const url = buildUrl("/products", {
        sortBy: "bestSelling",
        sortOrder: "desc",
        limit,
    });
    const payload = await fetchJson<PaginatedPayload<Product>>(url);

    return payload.data;
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

    return payload.data;
}

export async function fetchOccasions(limit = 50): Promise<Occasion[]> {
    const url = buildUrl("/occasions", { limit });
    const payload = await fetchJson<PaginatedPayload<Occasion>>(url);

    return payload.data;
}
