"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";

import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

import { ProductCard } from "./product-card";

interface ProductCarouselProps {
    products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
    // Translation
    const t = useTranslations("home.carousel");

    // Navigation
    const locale = useLocale();

    // Ref
    const trackRef = useRef<HTMLDivElement>(null);

    // Variables
    const isRtl = locale === "ar";

    // Functions
    const scrollByCards = (direction: "prev" | "next") => {
        const track = trackRef.current;
        if (!track) return;

        const amount = track.clientWidth * 0.8;
        const sign = direction === "next" ? 1 : -1;
        const delta = (isRtl ? -sign : sign) * amount;

        track.scrollBy({ left: delta, behavior: "smooth" });
    };

    return (
        <div className="relative">
            <div
                ref={trackRef}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="w-[82%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            <CarouselButton side="prev" isRtl={isRtl} label={t("previous")} onClick={() => scrollByCards("prev")} />
            <CarouselButton side="next" isRtl={isRtl} label={t("next")} onClick={() => scrollByCards("next")} />
        </div>
    );
}

function CarouselButton({
    side,
    isRtl,
    label,
    onClick,
}: {
    side: "prev" | "next";
    isRtl: boolean;
    label: string;
    onClick: () => void;
}) {
    // The "prev" control sits on the leading edge, flipped for RTL.
    const onLeft = side === "prev" ? !isRtl : isRtl;
    const Icon = onLeft ? ChevronLeft : ChevronRight;

    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className={cn(
                "absolute top-1/2 z-10 hidden -translate-y-1/2 place-items-center md:grid",
                "size-[38px] rounded-full bg-bg-primary-fixed text-text-inverse shadow-md",
                "transition-opacity hover:opacity-90",
                onLeft ? "-left-3" : "-right-3"
            )}
        >
            <Icon className="size-5" aria-hidden="true" />
        </button>
    );
}
