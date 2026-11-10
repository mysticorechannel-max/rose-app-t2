"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductSuggestions } from "../products.api";
import { productKeys } from "../products.keys";

export function useProductSuggestions(limit: number = 5) {
  return useQuery({
    queryKey: productKeys.suggestions(),
    queryFn: () => getProductSuggestions(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
