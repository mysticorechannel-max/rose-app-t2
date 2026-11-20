/**
 * React Query keys for products.
 * Centralized to keep query/mutation keys consistent.
 */

export const productKeys = {
    all: ["products"] as const,
    mostPopular: (occasionId: string, limit: number) =>
        [...productKeys.all, "most-popular", occasionId, limit] as const,
} as const;
