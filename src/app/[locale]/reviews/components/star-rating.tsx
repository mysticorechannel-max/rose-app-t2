import { Star } from "lucide-react";

import { cn } from "@/shared/lib/utils/tailwindcn.utils";

export const MAX_STARS = 5;
const HALF_STEP = 0.5;
const FULL_PERCENT = 100;

export function roundToHalf(value: number): number {
  return Math.round(value / HALF_STEP) * HALF_STEP;
}

// How much of the star at `starIndex` (0-based) is filled, from 0 to 100.
export function getFillPercent(value: number, starIndex: number): number {
  const fill = Math.min(Math.max(value - starIndex, 0), 1);
  return fill * FULL_PERCENT;
}

type PartialStarProps = {
  fillPercent: number;
  sizeClassName?: string;
  outlineClassName?: string;
};

// An empty star with a filled copy on top, clipped to `fillPercent` of its width.
export function PartialStar({
  fillPercent,
  sizeClassName = "size-4",
  outlineClassName = "text-border-soft",
}: PartialStarProps) {
  return (
    <span className={cn("relative inline-block", sizeClassName)}>
      <Star aria-hidden="true" className={cn(sizeClassName, "fill-transparent", outlineClassName)} />
      <span
        className="absolute inset-y-0 start-0 overflow-hidden"
        style={{ width: `${fillPercent}%` }}
      >
        <Star
          aria-hidden="true"
          className={cn(sizeClassName, "max-w-none shrink-0 fill-bg-warning text-bg-warning")}
        />
      </span>
    </span>
  );
}

type StarRatingProps = {
  value: number;
  className?: string;
};

export function StarRating({ value, className }: StarRatingProps) {
  const rounded = roundToHalf(value);

  return (
    <div
      role="img"
      aria-label={`${rounded} / ${MAX_STARS}`}
      className={cn("flex items-center gap-0.5", className)}
    >
      {Array.from({ length: MAX_STARS }, (_, index) => (
        <PartialStar key={index} fillPercent={getFillPercent(rounded, index)} />
      ))}
    </div>
  );
}
