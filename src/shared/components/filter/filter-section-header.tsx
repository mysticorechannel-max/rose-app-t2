"use client";

import { X } from "lucide-react";

import { cn } from "@/shared/lib/utils/tailwindcn.utils";

type FilterSectionHeaderProps = {
  title: string;
  resetLabel: string;
  onReset: () => void;
  className?: string;
};

// Section title with the red "× Reset" action, as in Figma
export function FilterSectionHeader({
  title,
  resetLabel,
  onReset,
  className,
}: FilterSectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h3 className="text-lg font-semibold text-text-plain">{title}</h3>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex cursor-pointer items-center gap-1 text-sm leading-none font-normal text-text-danger transition-opacity hover:opacity-80 focus-visible:underline focus-visible:outline-none"
      >
        <X className="size-4" aria-hidden="true" />
        {resetLabel}
      </button>
    </div>
  );
}
