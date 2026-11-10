"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { useDebounce } from "@/shared/hooks/shared/use-debounce";
import { useProductSuggestions } from "@/shared/lib/apis/products/queries/use-product-suggestions";
import { useSearchProducts } from "@/shared/lib/apis/products/queries/use-search-products";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";

import { SearchDropdown } from "./search-dropdown";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
}

export function SearchDialog({
  open,
  onOpenChange,
  searchValue,
  onSearchValueChange,
}: SearchDialogProps) {
  const t = useTranslations("header");

  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(searchValue, 500);

  const isTyping = searchValue.trim().length > 0;

  // Product suggestions shown when the dialog opens
  const { data: suggestions, isLoading: isSuggestionsLoading } = useProductSuggestions(6);

  // Search results shown after the user starts typing.
  const { data: searchResults, isLoading: isSearchLoading } = useSearchProducts(
    {
      search: debouncedSearch,
      limit: 20,
    },
    open && debouncedSearch.trim().length >= 2
  );

  const products = isTyping
    ? (searchResults?.payload.data ?? [])
    : (suggestions?.payload.data ?? []);

  const isLoading = isTyping ? isSearchLoading : isSuggestionsLoading;

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [open]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchValueChange(event.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="
          w-[calc(100%-32px)]
          max-w-[972px]
          gap-0
          overflow-hidden
          rounded-[30px]
          p-0
        "
      >
        <DialogTitle className="sr-only">{t("searchPlaceholder")}</DialogTitle>

        {/* Search Input */}
        <div className="relative border-b border-border">
          <Search
            className="
              absolute
              left-4
              top-1/2
              h-[18px]
              w-[18px]
              -translate-y-1/2
              text-zinc-400
            "
          />

          <Input
            ref={inputRef}
            type="search"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={t("searchPlaceholder")}
            className="
              h-[54px]
              w-full
              rounded-none
              border-0
              pl-[42px]
              pr-4
              text-sm
              shadow-none
              focus-visible:ring-0
            "
          />
        </div>

        {/* Products */}
        <SearchDropdown
          products={products}
          isLoading={isLoading}
          searchQuery={searchValue}
          isTyping={isTyping}
        />
      </DialogContent>
    </Dialog>
  );
}
