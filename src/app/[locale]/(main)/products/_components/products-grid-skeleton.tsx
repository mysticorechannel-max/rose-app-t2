import { PRODUCTS_GRID_CLASS } from "@/shared/lib/constants/products.constant";
import { cn } from "@/shared/lib/utils/tailwindcn.utils";

// One stable id per placeholder (PRODUCTS_PAGE_SIZE = 12)
const SKELETON_SLOTS = [
  "slot-1",
  "slot-2",
  "slot-3",
  "slot-4",
  "slot-5",
  "slot-6",
  "slot-7",
  "slot-8",
  "slot-9",
  "slot-10",
  "slot-11",
  "slot-12",
] as const;

export function ProductsGridSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(PRODUCTS_GRID_CLASS, className)} aria-hidden="true">
      {SKELETON_SLOTS.map((slot) => (
        <div key={slot} className="flex flex-col gap-4">
          <div className="h-68 animate-pulse rounded-lg bg-bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-bg-muted" />
        </div>
      ))}
    </div>
  );
}
