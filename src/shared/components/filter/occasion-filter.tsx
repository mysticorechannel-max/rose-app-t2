"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useOccasions } from "@/shared/hooks/product-filter/use-ossasion";
import { FilterSectionHeader } from "./filter-section-header";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils/tailwindcn.utils";
import { useTranslations } from "next-intl";

type OccasionFilterProps = {
  value: string | null;
  onChange: (occasionId: string | null) => void;
};

export function OccasionFilter({ value, onChange }: OccasionFilterProps) {
  const t = useTranslations("filters.occasion");
  const observerTarget = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useOccasions();

  const occasions = useMemo(() => {
    return data?.pages.flatMap((page) => page.payload.data) ?? [];
  }, [data]);

  useEffect(() => {
    const target = observerTarget.current;

    if (!target || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <p className="text-sm text-text-muted">{t("loading")}</p>;
  }

  if (isError) {
    return <p className="text-sm text-text-danger">{t("error")}</p>;
  }

  return (
    <section className="space-y-3 border-b border-border-subtle pb-4">
      <FilterSectionHeader
        title={t("title")}
        resetLabel={t("reset")}
        onReset={() => onChange(null)}
      />

      <div className="grid grid-cols-2 gap-2.5">
        {occasions.map((occasion) => {
          const isSelected = value === occasion.id;

          return (
            <Button
              key={occasion.id}
              variant="ghost"
              onClick={() => onChange(isSelected ? null : occasion.id)}
              className={cn(
                "relative h-18.5 w-full cursor-pointer overflow-hidden rounded-sm p-0 transition-shadow",
                isSelected ? "ring-2 ring-bg-primary ring-offset-1" : "hover:shadow-md"
              )}
            >
              {occasion.image && (
                <Image
                  src={occasion.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              )}

              {/* No image from the API: brand gradient instead of a flat grey box */}
              <span
                className={cn(
                  "absolute inset-0",
                  occasion.image
                    ? "bg-bg-overlay"
                    : "bg-linear-to-br from-bg-primary-fixed to-bg-primary-strong"
                )}
              />

              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center whitespace-normal px-2 text-center text-base font-normal text-text-inverse dark:text-text-plain",
                  isSelected && "font-semibold"
                )}
              >
                {occasion.title}
              </span>
            </Button>
          );
        })}
      </div>

      {hasNextPage && (
        <div ref={observerTarget} className="py-2 text-center text-sm text-text-muted">
          {isFetchingNextPage ? t("loadingMore") : ""}
        </div>
      )}
    </section>
  );
}
