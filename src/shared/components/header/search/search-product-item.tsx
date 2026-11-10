"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { Product } from "@/shared/lib/types/product";

interface SearchProductItemProps {
  product: Product;
  searchQuery?: string;
}

export function SearchProductItem({
  product,
  searchQuery = "",
}: SearchProductItemProps) {
  const t = useTranslations("search.product");

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="font-semibold text-text-danger">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="flex  gap-4 px-2 py-2 transition-colors hover:bg-bg-subtle"
    >
      {/* Product Image */}
      <div className="relative size-[78px] shrink-0 overflow-hidden rounded-lg bg-bg-muted">
        {product?.cover ? (
          <Image
            src={product?.cover}
            alt={product?.title}
            fill
            sizes="78px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-text-muted">
            {t("noImage")}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-plain">
          {highlightMatch(product.title, searchQuery)}
        </p>

        <div className="mt-1 items-center flex gap-1">
          <span className="text-[20px] font-bold text-text-plain">{product.price}</span>

          <span className="text-[10px] text-text-plain -mb-1">{t("currency")}</span>
        </div>
      </div>

      {/* Product Rating */}
      <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
        <Star className="size-4 fill-amber-500 text-amber-500" />

        <span className="text-sm text-black dark:text-text-plain">
          {t("rating")}: <span className="font-semibold text-base">{product.rating}/5</span>
        </span>

        <span className="text-sm text-blue-600 dark:text-text-primary">({product.ratings} {t("ratings")})</span>
      </div>
    </Link>
  );
}

