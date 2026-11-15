"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { FiltersSidebar } from "@/shared/components/filter/filter-sidebar";
import type { ProductFilters } from "@/shared/lib/types/product-filter/product-filter";

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1_000_000;
const PRICE_DEBOUNCE_MS = 300;
const FILTER_KEYS = [
  "categoryId",
  "occasionId",
  "rating",
  "minPrice",
  "maxPrice",
] as const;

export function ProductsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: ProductFilters = {
    categoryId: searchParams.get("categoryId"),
    occasionId: searchParams.get("occasionId"),
    rating: searchParams.has("rating")
      ? Number(searchParams.get("rating"))
      : null,
    minPrice: searchParams.has("minPrice")
      ? Number(searchParams.get("minPrice"))
      : DEFAULT_MIN_PRICE,
    maxPrice: searchParams.has("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : DEFAULT_MAX_PRICE,
  };

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<Partial<ProductFilters>>({});

  const clearPending = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    pendingRef.current = {};
  }, []);

  const flush = useCallback(() => {
    const changes = pendingRef.current;
    pendingRef.current = {};
    timerRef.current = null;

    const params = new URLSearchParams(window.location.search);

    for (const [key, value] of Object.entries(changes)) {
      const isDefault =
        (key === "minPrice" && value === DEFAULT_MIN_PRICE) ||
        (key === "maxPrice" && value === DEFAULT_MAX_PRICE);

      if (value === null || value === undefined || isDefault) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [pathname, router]);

  const updateFilters = useCallback(
    (changes: Partial<ProductFilters>, debounce = false) => {
      pendingRef.current = { ...pendingRef.current, ...changes };

      if (timerRef.current) clearTimeout(timerRef.current);

      if (!debounce) {
        flush();
        return;
      }

      timerRef.current = setTimeout(flush, PRICE_DEBOUNCE_MS);
    },
    [flush],
  );

  useEffect(() => clearPending, [clearPending]);

  function handleResetAll() {
    clearPending();

    const params = new URLSearchParams(window.location.search);
    FILTER_KEYS.forEach((key) => params.delete(key));

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  return (
    <FiltersSidebar
      filters={filters}
      onCategoryChange={(value) => updateFilters({ categoryId: value })}
      onOccasionChange={(value) => updateFilters({ occasionId: value })}
      onRatingChange={(value) => updateFilters({ rating: value })}
      onPriceChange={(range) => updateFilters(range, true)}
      onResetAll={handleResetAll}
    />
  );
}