
"use client";

import { FiltersSidebar } from "@/shared/components/filter/filter-sidebar";
import { ProductFilters } from "@/shared/lib/types/product-filter/product-filter";
import { useSearchParams, useRouter } from "next/navigation";




const INITIAL_FILTERS: ProductFilters = {
  categoryId: null,
  occasionId: null,
  rating: null,
  minPrice: 0,
  maxPrice: 1_000_000,
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters: ProductFilters = {
    categoryId: searchParams.get("categoryId") || null,
    occasionId: searchParams.get("occasionId") || null,
    rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : null,
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 1_000_000,
  };

  function updateFilters(newFilters: Partial<ProductFilters>) {
    const params = new URLSearchParams(searchParams.toString());

    // Map field names to URL parameter names
    const paramMap: Record<keyof ProductFilters, string> = {
      categoryId: "categoryId",
      occasionId: "occasionId",
      rating: "rating",
      minPrice: "minPrice",
      maxPrice: "maxPrice",
    };

    Object.entries(newFilters).forEach(([key, value]) => {
      const paramName = paramMap[key as keyof ProductFilters];
      if (value === null || value === undefined || value === 0 || value === 1_000_000) {
        params.delete(paramName);
      } else {
        params.set(paramName, String(value));
      }
    });

    router.push(`?${params.toString()}`);
  }

  function handleResetAll() {
    router.push("");
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <div className="w-72 shrink-0">
          <FiltersSidebar
            filters={filters}
            onCategoryChange={(value) => updateFilters({ categoryId: value })}
            onOccasionChange={(value) => updateFilters({ occasionId: value })}
            onRatingChange={(value) => updateFilters({ rating: value })}
            onMinPriceChange={(value) => updateFilters({ minPrice: value })}
            onMaxPriceChange={(value) => updateFilters({ maxPrice: value })}
            onResetAll={handleResetAll}
          />
        </div>

        <div className="min-w-0 flex-1">
    {/* */}
        </div>
      </div>
    </main>
  );
}
