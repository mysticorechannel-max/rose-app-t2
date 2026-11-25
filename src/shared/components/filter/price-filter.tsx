"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/shared/ui/input";

import { FilterSectionHeader } from "./filter-section-header";

type PriceRange = { minPrice: number; maxPrice: number };

type PriceFilterProps = PriceRange & {
  onPriceChange: (range: PriceRange) => void;
};

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1_000_000;

function toDisplay(value: number, defaultValue: number) {
  return value === defaultValue ? "" : String(value);
}

export function PriceFilter({ minPrice, maxPrice, onPriceChange }: PriceFilterProps) {
  const t = useTranslations("filters.price");

  const [from, setFrom] = useState(toDisplay(minPrice, DEFAULT_MIN_PRICE));
  const [to, setTo] = useState(toDisplay(maxPrice, DEFAULT_MAX_PRICE));

  const lastSentRef = useRef<PriceRange>({ minPrice, maxPrice });

  useEffect(() => {
    if (minPrice !== lastSentRef.current.minPrice || maxPrice !== lastSentRef.current.maxPrice) {
      setFrom(toDisplay(minPrice, DEFAULT_MIN_PRICE));
      setTo(toDisplay(maxPrice, DEFAULT_MAX_PRICE));
      lastSentRef.current = { minPrice, maxPrice };
    }
  }, [minPrice, maxPrice]);

  const parsedMin = from === "" ? DEFAULT_MIN_PRICE : Number(from);
  const parsedMax = to === "" ? DEFAULT_MAX_PRICE : Number(to);

  const isMinInvalid = parsedMin < 0 || Number.isNaN(parsedMin);
  const isMaxInvalid = parsedMax < 0 || Number.isNaN(parsedMax);
  const isRangeInvalid = !isMinInvalid && !isMaxInvalid && parsedMin >= parsedMax;
  const isInvalid = isMinInvalid || isMaxInvalid || isRangeInvalid;

  function handleChange(nextFrom: string, nextTo: string) {
    setFrom(nextFrom);
    setTo(nextTo);

    const min = nextFrom === "" ? DEFAULT_MIN_PRICE : Number(nextFrom);
    const max = nextTo === "" ? DEFAULT_MAX_PRICE : Number(nextTo);

    if (Number.isNaN(min) || Number.isNaN(max) || min < 0 || max < 0 || min >= max) {
      return;
    }

    lastSentRef.current = { minPrice: min, maxPrice: max };
    onPriceChange({ minPrice: min, maxPrice: max });
  }

  function handleReset() {
    setFrom("");
    setTo("");
    lastSentRef.current = {
      minPrice: DEFAULT_MIN_PRICE,
      maxPrice: DEFAULT_MAX_PRICE,
    };
    onPriceChange(lastSentRef.current);
  }

  return (
    <section className="space-y-3 border-b border-border-subtle pb-4">
      <FilterSectionHeader title={t("title")} resetLabel={t("reset")} onReset={handleReset} />

      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <label htmlFor="min-price" className="block text-sm text-text-plain">
            {t("from")}
          </label>
          <Input
            id="min-price"
            type="number"
            min={0}
            value={from}
            placeholder={String(DEFAULT_MIN_PRICE)}
            aria-invalid={isMinInvalid || isRangeInvalid}
            onChange={(event) => handleChange(event.target.value, to)}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="max-price" className="block text-sm text-text-plain">
            {t("to")}
          </label>
          <Input
            id="max-price"
            type="number"
            min={0}
            value={to}
            placeholder={String(DEFAULT_MAX_PRICE)}
            aria-invalid={isMaxInvalid || isRangeInvalid}
            onChange={(event) => handleChange(from, event.target.value)}
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
