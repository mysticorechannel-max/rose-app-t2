"use client";

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { CategoryFilter } from "./category-filter";
import { OccasionFilter } from "./occasion-filter";
import { RatingFilter } from "./rating-filter";
import { PriceFilter } from "./price-filter";

import { Button } from "@/shared/ui/button";
import { ProductFilters } from "@/shared/lib/types/product-filter/product-filter";

type FiltersSidebarProps = {
  filters: ProductFilters;
  onCategoryChange: (value: string | null) => void;
  onOccasionChange: (value: string | null) => void;
  onRatingChange: (value: number | null) => void;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  onPriceReset: () => void;
  onResetAll: () => void;
};

export function FiltersSidebar({
  filters,
  onCategoryChange,
  onOccasionChange,
  onRatingChange,
  onMinPriceChange,
  onMaxPriceChange,
  onPriceReset,
  onResetAll,
}: FiltersSidebarProps) {
  const t = useTranslations("filters");

  const hasActiveFilters =
    filters.categoryId !== null ||
    filters.occasionId !== null ||
    filters.rating !== null ||
    filters.minPrice !== 0 ||
    filters.maxPrice !== 1_000_000;

  return (
    <aside className="w-full space-y-4">
      <CategoryFilter
        value={filters.categoryId}
        onChange={onCategoryChange}
      />

      <OccasionFilter
        value={filters.occasionId}
        onChange={onOccasionChange}
      />

      <RatingFilter
        value={filters.rating}
        onChange={onRatingChange}
      />

      <PriceFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onMinPriceChange={onMinPriceChange}
        onMaxPriceChange={onMaxPriceChange}
        onPriceReset={onPriceReset}
      />

      <Button
        variant="ghost"
        onClick={onResetAll}
        disabled={!hasActiveFilters}
        className="h-12 w-full bg-bg-soft text-base text-text-primary hover:bg-bg-default"
      >
        <RotateCcw />
        {t("resetAll")}
      </Button>
    </aside>
  );
}
