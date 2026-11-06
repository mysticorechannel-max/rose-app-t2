"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { Input } from "@/shared/ui/input";

export function SearchBar() {
  // Translation
  const t = useTranslations("header");

  const searchParams = useSearchParams();



  return (
    <div className="relative hidden flex-1 md:block">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={t("searchPlaceholder")}
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => console.log("hi")}
        className="w-full pl-10 pr-4 h-13 rounded-lg"
      />
    </div>
  );
}
