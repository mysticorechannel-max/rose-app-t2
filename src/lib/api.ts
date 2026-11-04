import type {
    ApiResponse,
    Company,
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

// The Most Popular tabs always show these four, in this order (per Figma),
// even when the backend has no matching occasion. Matched tabs use the real
// occasion id; the rest keep a slug placeholder.
const MOST_POPULAR_OCCASIONS = ["Wedding", "Anniversary", "Birthday", "Engagement"];

export async function fetchOccasions(limit = 50): Promise<Occasion[]> {
    const url = buildUrl("/occasions", { limit });
    const payload = await fetchJson<PaginatedPayload<Occasion>>(url);

    return MOST_POPULAR_OCCASIONS.map((title) => {
        const match = payload.data.find(
            (occasion) => occasion.title.toLowerCase() === title.toLowerCase()
        );

        if (match) return { ...match, title };

        // No backend occasion for this title — keep the tab but leave `id` empty
        // so the API call omits `occasionId` (buildUrl skips "") instead of
        // sending an unknown id that the backend rejects with 400.
        return {
            id: "",
            title,
            description: null,
            image: null,
            createdAt: "",
            updatedAt: "",
        } satisfies Occasion;
    });
}

// Partner companies for the "Trusted by" strip. The backend has no companies
// endpoint yet, so this returns null on any failure (404, network, etc.) and
// the caller falls back to the static logos. When the endpoint ships, this
// starts returning real data with no change to the component.
export async function fetchCompanies(limit = 12): Promise<Company[] | null> {
    try {
        const url = buildUrl("/companies", { limit });
        const payload = await fetchJson<PaginatedPayload<Company>>(url);

        return payload.data;
    } catch {
        return null;
    }
}
