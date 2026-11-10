"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Input } from "@/shared/ui/input";
import { SearchDialog } from "./search-dialog";

export function SearchBar() {
  const t = useTranslations("header");

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
  };

  const handleSearchOpenChange = (open: boolean) => {
    setIsSearchOpen(open);

    if (!open) {
      setSearchValue("");
    }
  };

  return (
    <>
      <div className="relative hidden flex-1 md:block">
        <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-400" />

        <Input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={searchValue}
          onFocus={handleOpenSearch}
          onChange={(event) => handleSearchValueChange(event.target.value)}
          className="h-[52px] w-full rounded-[10px] border-zinc-300 pl-[42px] pr-4 text-sm placeholder:text-zinc-400"
        />
      </div>

      <SearchDialog
        open={isSearchOpen}
        onOpenChange={handleSearchOpenChange}
        searchValue={searchValue}
        onSearchValueChange={handleSearchValueChange}
      />
    </>
  );
}
