"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Product } from "@/shared/lib/types/product";
import { SearchProductItem } from "./search-product-item";

interface SearchDropdownProps {
  products: Product[];
  isLoading: boolean;
  searchQuery: string;
  isTyping: boolean;
}

export function SearchDropdown({
  products,
  isLoading,
  searchQuery,
  isTyping,
}: SearchDropdownProps) {
  const t = useTranslations("search");

  return (
    <div className="bg-bg-plain">
      {/* Header */}
      <div className="border-b border-border bg-bg-subtle px-4 py-3">
        <h3 className="text-base font-semibold text-text-primary">
          {isTyping ? t("searchResults") : t("suggestionsTitle")}
        </h3>
      </div>

      {/* Products */}
      <div className="max-h-[520px] overflow-y-auto scrollbar-hide">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-8">
            <Loader2 className="size-5 animate-spin text-primary" />

            <span className="text-sm text-text-muted">{t("loading")}</span>
          </div>
        ) : products.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-text-muted">
              {isTyping ? t("noResults") : t("noSuggestions")}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {products.map((product) => (
              <li key={product.id}>
                <SearchProductItem product={product} searchQuery={searchQuery} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
