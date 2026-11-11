
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import { FiltersSidebar } from "@/shared/components/filter/filter-sidebar";
import type { ProductFilters } from "@/shared/lib/types/product-filter/product-filter";

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1_000_000;

export function ProductsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current filters from the URL
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

  // Update URL parameters without adding a history entry for every change
  const pendingFiltersRef = useRef<Partial<ProductFilters> | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Store pending filters
    pendingFiltersRef.current = newFilters;

    // Debounce the URL update
    debounceTimerRef.current = setTimeout(() => {
      if (!pendingFiltersRef.current) return;

      const params = new URLSearchParams(searchParams.toString());

      Object.entries(pendingFiltersRef.current).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          params.delete(key);
          return;
        }

        if (
          (key === "minPrice" && value === DEFAULT_MIN_PRICE) ||
          (key === "maxPrice" && value === DEFAULT_MAX_PRICE)
        ) {
          params.delete(key);
          return;
        }

        params.set(key, String(value));
      });

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });

      pendingFiltersRef.current = null;
    }, 300); // 300ms debounce
  }, [searchParams, pathname, router]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  function handleResetAll() {
    router.replace(pathname, { scroll: false });
  }

  function handlePriceReset() {
    updateFilters({
      minPrice: DEFAULT_MIN_PRICE,
      maxPrice: DEFAULT_MAX_PRICE,
    });
  }

  return (
    <FiltersSidebar
      filters={filters}
      onCategoryChange={(value) => updateFilters({ categoryId: value })}
      onOccasionChange={(value) => updateFilters({ occasionId: value })}
      onRatingChange={(value) => updateFilters({ rating: value })}
      onMinPriceChange={(value) => updateFilters({ minPrice: value })}
      onMaxPriceChange={(value) => updateFilters({ maxPrice: value })}
      onPriceReset={handlePriceReset}
      onResetAll={handleResetAll}
    />
  );
}
