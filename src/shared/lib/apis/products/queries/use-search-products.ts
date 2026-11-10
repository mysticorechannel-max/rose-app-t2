"use client";

import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../products.api";
import { productKeys } from "../products.keys";
import type { ProductSearchParams } from "@/shared/lib/types/product";

export function useSearchProducts(params: ProductSearchParams, enabled: boolean = true) {
  return useQuery({
    queryKey: productKeys.search(params.search || ""),
    queryFn: () => searchProducts(params),
    enabled: enabled && !!params.search && params.search.length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });
}
