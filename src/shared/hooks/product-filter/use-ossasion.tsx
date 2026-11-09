"use client";


import { getOccasions } from "@/shared/lib/apis/product-filter/ossasion.service";
import { useInfiniteQuery } from "@tanstack/react-query";


export function useOccasions(search?: string) {
  return useInfiniteQuery({
    queryKey: ["occasions", search],
    queryFn: ({ pageParam }) =>
      getOccasions({
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