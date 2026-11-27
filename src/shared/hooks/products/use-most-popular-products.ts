import { useQuery } from "@tanstack/react-query";

import { getMostPopularProducts } from "@/shared/lib/apis/products/products.api";
import { productKeys } from "@/shared/lib/apis/products/products.keys";
import type { Product } from "@/types/product";

interface UseMostPopularProductsParams {
    occasionId: string;
    limit: number;
    initialData?: Product[];
}

/**
 * Reads most popular products for a given occasion via React Query.
 * Hydrated from server-fetched initialData for the first tab.
 */
export function useMostPopularProducts({
    occasionId,
    limit,
    initialData,
}: UseMostPopularProductsParams) {
    return useQuery({
        queryKey: productKeys.mostPopular(occasionId, limit),
        queryFn: () => getMostPopularProducts(occasionId, limit),
        enabled: occasionId !== "",
        initialData,
        staleTime: 60 * 1000,
    });
}
