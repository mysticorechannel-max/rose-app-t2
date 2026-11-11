"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

type PriceFilterProps = {
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  onPriceReset: () => void;
};

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1_000_000;

export function PriceFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onPriceReset,
}: PriceFilterProps) {
  const t = useTranslations("filters.price");

  const isMinChanged = minPrice !== DEFAULT_MIN_PRICE;
  const isMaxChanged = maxPrice !== DEFAULT_MAX_PRICE;
  const isPriceChanged = isMinChanged || isMaxChanged;

  const isInvalid =
    minPrice < 0 || maxPrice < 0 || minPrice >= maxPrice;

  const inputClass =
    "h-12 w-full rounded-xl border border-border-soft bg-bg-soft px-4 text-base outline-none transition-colors focus:border-border-primary";

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-plain">
          {t("title")}
        </h3>

        {isPriceChanged && (
          <button
            type="button"
            onClick={onPriceReset}
            className="flex items-center gap-1.5 text-base text-text-danger transition-opacity hover:opacity-80"
          >
            <X size={18} />
            {t("reset")}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="min-price"
            className="block text-base text-text-plain"
          >
            {t("from")}
          </label>

          <input
            id="min-price"
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) =>
              onMinPriceChange(Number(event.target.value))
            }
            className={`${inputClass} ${
              isMinChanged ? "text-text-plain" : "text-text-muted"
            }`}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="max-price"
            className="block text-base text-text-plain"
          >
            {t("to")}
          </label>

          <input
            id="max-price"
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) =>
              onMaxPriceChange(Number(event.target.value))
            }
            className={`${inputClass} ${
              isMaxChanged ? "text-text-plain" : "text-text-muted"
            }`}
          />
        </div>
      </div>

      {isInvalid && (
        <p className="text-sm text-text-danger" role="alert">
          {t("error")}
        </p>
      )}
    </section>
  );
}
