"use client";

import { useEffect, useMemo, useRef } from "react";
import { X } from "lucide-react";
import { useOccasions } from "@/shared/hooks/product-filter/use-ossasion";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils/tailwindcn.utils";
import { useTranslations } from "next-intl";


type OccasionFilterProps = {
  value: string | null;
  onChange: (occasionId: string | null) => void;
};

const LOCAL_IMAGES: { keyword: string; src: string }[] = [
  { keyword: "wedding", src: "/occasions/img/wedding.png" },
  { keyword: "apology", src: "/occasions/img/apology.png" },
  { keyword: "graduation", src: "/occasions/img/graduation.png" },
  { keyword: "father", src: "/occasions/img/father.png" },
];

function resolveOccasionImage(title: string, apiImage?: string | null) {
  // 1) صورة الـ API لو موجودة وغير فاضية
  if (apiImage && apiImage.trim() !== "") return apiImage;

  // 2) صورة محلية بالاسم
  const normalized = title.toLowerCase();
  const match = LOCAL_IMAGES.find((item) => normalized.includes(item.keyword));
  return match?.src ?? null;
}

export function OccasionFilter({ value, onChange }: OccasionFilterProps) {
  const t = useTranslations("filters.occasion");
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOccasions();

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

      <div className="grid grid-cols-2 gap-3">
        {occasions.map((occasion) => {
          const isSelected = value === occasion.id;
          const imageSrc = resolveOccasionImage(occasion.title, occasion.image);

          return (
            <Button
              key={occasion.id}
              variant="ghost"
              onClick={() => onChange(isSelected ? null : occasion.id)}
              className={cn(
                "relative h-[128px] w-full overflow-hidden rounded-xl p-0 bg-gradient-to-br from-bg-muted to-border-plain hover:opacity-90",
                isSelected && "ring-2 ring-primary"
              )}
            >
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={occasion.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}

              <span className="absolute inset-0 bg-black/40" />

              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center whitespace-normal px-2 text-center text-base font-normal text-white",
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
        <div
          ref={observerTarget}
          className="py-2 text-center text-sm text-text-muted"
        >
          {isFetchingNextPage ? t("loadingMore") : ""}
        </div>
      )}
    </section>
  );
}