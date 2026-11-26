"use client";

import { useTranslations } from "next-intl";
import * as React from "react";

import { cn } from "@/shared/lib/utils/tailwindcn.utils";
import { getFillPercent, MAX_STARS, PartialStar } from "./star-rating";

const HALF_STEP = 0.5;
const STAR_SIZE = "size-7";

type HalfButtonProps = {
  rating: number;
  side: "start" | "end";
  isSelected: boolean;
  onSelect: (rating: number) => void;
  onPreview: (rating: number | null) => void;
};

// Each star has two invisible buttons on top: one for the half, one for the full star.
function HalfButton({ rating, side, isSelected, onSelect, onPreview }: HalfButtonProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={String(rating)}
      onClick={() => onSelect(rating)}
      onMouseEnter={() => onPreview(rating)}
      onFocus={() => onPreview(rating)}
      onBlur={() => onPreview(null)}
      className={cn(
        "absolute inset-y-0 w-1/2 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring",
        side === "start" ? "start-0" : "end-0"
      )}
    />
  );
}

type RatingInputProps = {
  value: number;
  onChange: (value: number) => void;
};

export function RatingInput({ value, onChange }: RatingInputProps) {
  // Translation
  const t = useTranslations("reviews");

  // State
  const [previewValue, setPreviewValue] = React.useState<number | null>(null);

  // Variables
  const shownValue = previewValue ?? value;

  return (
    <div
      role="radiogroup"
      aria-label={t("yourRating")}
      className="flex items-center gap-1"
      onMouseLeave={() => setPreviewValue(null)}
    >
      {Array.from({ length: MAX_STARS }, (_, index) => {
        const halfRating = index + HALF_STEP;
        const fullRating = index + 1;

        return (
          <span key={index} className="relative inline-block">
            <PartialStar
              fillPercent={getFillPercent(shownValue, index)}
              sizeClassName={STAR_SIZE}
              outlineClassName="text-bg-warning"
            />
            <HalfButton
              rating={halfRating}
              side="start"
              isSelected={value === halfRating}
              onSelect={onChange}
              onPreview={setPreviewValue}
            />
            <HalfButton
              rating={fullRating}
              side="end"
              isSelected={value === fullRating}
              onSelect={onChange}
              onPreview={setPreviewValue}
            />
          </span>
        );
      })}
    </div>
  );
}
