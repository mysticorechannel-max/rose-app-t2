"use client";

import { useEffect, useMemo, useRef } from "react";
import { Tag, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useCategories } from "@/shared/hooks/product-filter/use-categories";
import { cn } from "@/shared/lib/utils/tailwindcn.utils";
import { useTranslations } from "next-intl";

type CategoryFilterProps = {
  value: string | null;
  onChange: (categoryId: string | null) => void;
};

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const t = useTranslations("filters.category");
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCategories();

  useEffect(() => {
    const target = observerTarget.current;
    const root = scrollRef.current;

    if (!target || !root || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { root, threshold: 0.1 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const categories = useMemo(() => {
    const items = data?.pages.flatMap((page) => page.payload.data) ?? [];

    return [...items].sort((a, b) => a.title.localeCompare(b.title));
  }, [data]);

  if (isLoading) {
    return <p className="text-sm text-text-muted">{t("loading")}</p>;
  }

  if (isError) {
    return <p className="text-sm text-text-danger">{t("error")}</p>;
  }

  return (
    <section className="space-y-3 border-b border-border-plain pb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-plain">{t("title")}</h3>

        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
            className="h-auto gap-1 px-1 py-0.5 text-sm font-normal text-text-danger hover:bg-transparent hover:opacity-80"
          >
            <X size={14} />
            {t("reset")}
          </Button>
        )}
      </div>

      <div ref={scrollRef} className="max-h-60 space-y-2 overflow-y-auto">
        {categories.map((category) => {
          const isSelected = value === category.id;
          const image = (category as { image?: string | null }).image;

          return (
            <Button
              key={category.id}
              variant="ghost"
              onClick={() => onChange(isSelected ? null : category.id)}
              className={cn(
                "h-7 w-full justify-start gap-0 overflow-hidden rounded-md p-0 font-normal",
                isSelected
                  ? "bg-bg-primary-faint text-text-inverse hover:bg-bg-primary-faint"
                  : "bg-bg-soft text-text-plain hover:bg-bg-default"
              )}
            >
              <span
                className={cn(
                  "flex h-full w-9 shrink-0 items-center justify-center",
                  isSelected ? "bg-bg-primary" : "bg-bg-default"
                )}
              >
                {image ? (
                  <img src={image} alt="" className="size-4 object-contain" />
                ) : (
                  <Tag className="text-white" />
                )}
              </span>

              <span className="min-w-0 flex-1 truncate px-3 text-start">
                {category.title}
              </span>
            </Button>
          );
        })}

        {hasNextPage && (
          <div
            ref={observerTarget}
            className="py-1 text-center text-xs text-text-muted"
          >
            {isFetchingNextPage ? t("loadingMore") : ""}
          </div>
        )}
      </div>
    </section>
  );
}