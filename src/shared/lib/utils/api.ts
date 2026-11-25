import "server-only";

import { isNewProduct, parseGallery } from "@/shared/lib/utils/product";
import type {
    ApiResponse,
    Occasion,
    PaginatedPayload,
    Product,
    ProductDetails,
} from "@/types/product";

// Server-only API host. Never exposed to the browser.
const API_BASE_URL = process.env.API_URL;

type QueryValue = string | number | undefined;
type ProductListItem = Omit<Product, "cover"> & { cover: string | null };

const RELATED_PRODUCTS_LIMIT = 12;
const RELATED_PRODUCTS_FALLBACK_COVER = "/assets/images/logo.png";

export class ApiRequestError extends Error {
    constructor(
        public readonly status: number,
        url: string
    ) {
        super(`Request failed (${status}) for ${url}`);
        this.name = "ApiRequestError";
    }
}

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
        throw new ApiRequestError(response.status, url);
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

export async function fetchProductById(id: string): Promise<ProductDetails> {
    const productId = id.trim();

    if (!productId) {
        throw new Error("Product ID is required");
    }

    const url = buildUrl(`/products/${encodeURIComponent(productId)}`);
    const payload = await fetchJson<{ product: ProductDetails }>(url);

    return payload.product;
}

export async function fetchRelatedProducts({
    productId,
    categoryId,
    subCategoryId,
}: {
    productId: string;
    categoryId: string;
    subCategoryId: string | null;
}): Promise<Product[]> {
    const currentProductId = productId.trim();
    const categoryFilterId = subCategoryId?.trim() || categoryId.trim();

    if (!currentProductId || !categoryFilterId) return [];

    const categoryFilter = subCategoryId?.trim()
        ? { subCategoryId: categoryFilterId }
        : { categoryId: categoryFilterId };
    const url = buildUrl("/products", {
        page: 1,
        limit: RELATED_PRODUCTS_LIMIT + 1,
        ...categoryFilter,
    });
    const payload = await fetchJson<PaginatedPayload<ProductListItem>>(url);
    const relatedProducts = payload.data
        .filter((product) => product.id !== currentProductId)
        .slice(0, RELATED_PRODUCTS_LIMIT)
        .map((product): Product => ({
            ...product,
            cover:
                product.cover ||
                parseGallery(product.gallery)[0] ||
                RELATED_PRODUCTS_FALLBACK_COVER,
        }));

    return withNewFlag(relatedProducts);
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
