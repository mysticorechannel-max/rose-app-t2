import type { ProductSearchParams } from "@/shared/lib/types/product";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params?: ProductSearchParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  suggestions: () => [...productKeys.all, "suggestions"] as const,
  search: (query: string) => [...productKeys.all, "search", query] as const,
} as const;
