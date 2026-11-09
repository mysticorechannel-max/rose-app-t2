"use client";

import { Button } from "@/shared/ui/button";
import { Star, X } from "lucide-react";
import { useTranslations } from "next-intl";


type RatingFilterProps = {
  value: number | null;
  onChange: (rating: number | null) => void;
};

const hitZoneClass =
  "absolute inset-y-0 h-auto w-1/2 rounded-none p-0 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0";

export function RatingFilter({ value, onChange }: RatingFilterProps) {
  const t = useTranslations("filters.rating");
  const stars = [1, 2, 3, 4, 5];

  function select(rating: number) {
    onChange(value === rating ? null : rating);
  }

  return (
    <section className="space-y-3 border-b border-border-plain pb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-plain">{t("title")}</h3>

        {value !== null && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
            className="h-auto gap-1 px-1 py-0.5 text-sm font-normal text-text-danger hover:bg-transparent hover:opacity-80"
          >
            <X size={14} />
            {t("reset")}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1" role="group" aria-label="Rating" dir="rtl">
        {stars.map((star) => {
          const current = value ?? 0;
          const isFull = star <= current;
          const isHalf = star - 0.5 === current;

          return (
            <span key={star} className="relative inline-flex">
              <Star
                size={24}
                className={
                  isFull
                    ? "fill-current text-text-warning"
                    : "text-text-warning"
                }
              />

              {isHalf && (
                <span className="absolute inset-y-0 start-0 w-1/2 overflow-hidden">
                  <Star size={24} className="fill-current text-text-warning" />
                </span>
              )}

              {/* start half = x.5, end half = full star */}
              <Button
                variant="ghost"
                aria-label={`${star - 0.5} stars`}
                onClick={() => select(star - 0.5)}
                className={`${hitZoneClass} start-0`}
              />
              <Button
                variant="ghost"
                aria-label={`${star} stars`}
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