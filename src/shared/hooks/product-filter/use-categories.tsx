"use client";


import { getCategories } from "@/shared/lib/apis/product-filter/categories.service";
import { useInfiniteQuery } from "@tanstack/react-query";


export function useCategories(search?: string) {
  return useInfiniteQuery({
    queryKey: ["categories", search],
    queryFn: ({ pageParam }) =>
      getCategories({
        page: pageParam,
        limit: 20,
        search,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.payload.metadata;

      return page < totalPages ? page + 1 : undefined;
    },
  });
}