"use client";

import { Button } from "@/shared/ui/button";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { FilterSectionHeader } from "./filter-section-header";

type RatingFilterProps = {
  value: number | null;
  onChange: (rating: number | null) => void;
};

const hitZoneClass =
  "absolute inset-y-0 h-auto w-1/2 cursor-pointer rounded-none p-0 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0";

export function RatingFilter({ value, onChange }: RatingFilterProps) {
  const t = useTranslations("filters.rating");
  const stars = [1, 2, 3, 4, 5];

  function select(rating: number) {
    onChange(value === rating ? null : rating);
  }

  return (
    <section className="space-y-3 border-b border-border-subtle pb-4">
      <FilterSectionHeader
        title={t("title")}
        resetLabel={t("reset")}
        onReset={() => onChange(null)}
      />

      <div className="flex items-center gap-1.5" role="group" aria-label={t("title")}>
        {stars.map((star) => {
          const current = value ?? 0;
          const isFull = star <= current;
          const isHalf = star - 0.5 === current;

          return (
            <span key={star} className="relative inline-flex">
              <Star
                size={24}
                className={isFull ? "fill-current text-text-warning" : "text-text-warning"}
              />

              {isHalf && (
                <span className="absolute inset-y-0 start-0 w-1/2 overflow-hidden">
                  <Star size={24} className="fill-current text-text-warning" />
                </span>
              )}

              <Button
                type="button"
                variant="ghost"
                aria-label={t("starLabel", { count: star - 0.5 })}
                onClick={() => select(star - 0.5)}
                className={`${hitZoneClass} start-0`}
              />
              <Button
                type="button"
                variant="ghost"
                aria-label={t("starLabel", { count: star })}
                onClick={() => select(star)}
                className={`${hitZoneClass} end-0`}
              />
            </span>
          );
        })}
      </div>
    </section>
  );
}
