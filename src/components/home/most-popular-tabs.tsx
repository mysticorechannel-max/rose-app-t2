"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/utils/tailwindcn.utils";
import type { Occasion, Product } from "@/types/product";

import { getMostPopularByOccasion } from "./most-popular-actions";
import { ProductGrid } from "./product-grid";

interface MostPopularTabsProps {
    occasions: Occasion[];
    initialProducts: Product[];
    title: string;
    viewMoreLabel: string;
}

export function MostPopularTabs({
    occasions,
    initialProducts,
    title,
    viewMoreLabel,
}: MostPopularTabsProps) {
    // State
    const [activeTitle, setActiveTitle] = useState(occasions[0]?.title ?? "");
    const [products, setProducts] = useState(initialProducts);
    const [isPending, startTransition] = useTransition();

    // Functions
    const handleTabChange = (occasion: Occasion) => {
        if (occasion.title === activeTitle) return;
        setActiveTitle(occasion.title);
        startTransition(async () => {
            const next = await getMostPopularByOccasion(occasion.id);
            setProducts(next);
        });
    };

    return (
        <div>
            {/* Header: title left, occasion tabs right — per Figma */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-4xl font-bold leading-none text-text-primary-strong">
                    <span className="relative isolate inline-block">
                        {/* Band covers bottom ~62% of text height, rounded right only */}
                        <span
                            aria-hidden="true"
                            className="absolute -bottom-3 left-0 z-[-1] h-[62%] w-[72%] rounded-r-[40px] bg-bg-heading-band"
                        />
                        {/* Darker pink underline — sits just below the band */}
                        <span
                            aria-hidden="true"
                            className="absolute -bottom-3 left-0 z-[-1] h-[4px] w-[55%] bg-bg-heading-underline"
                        />
                        {title}
                    </span>
                </h2>

                <div className="flex flex-wrap items-center gap-6">
                    {occasions.map((occasion) => {
                        const isActive = occasion.title === activeTitle;
                        return (
                            <button
                                key={occasion.title}
                                type="button"
                                onClick={() => handleTabChange(occasion)}
                                className={cn(
                                    "text-base font-medium transition-colors",
                                    isActive
                                        ? "text-text-primary-strong"
                                        : "text-text-plain hover:text-text-primary-strong"
                                )}
                            >
                                {occasion.title}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Grid dims + spinner overlay while fetching next tab */}
            <div className="relative">
                <div className={cn("transition-opacity duration-200", isPending && "pointer-events-none opacity-50")}>
                    <ProductGrid products={products} />
                </div>
                {isPending && (
                    <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-20">
                        <Loader2 className="size-8 animate-spin text-text-primary-strong" aria-hidden="true" />
                    </div>
                )}
            </div>

            {/* View more */}
            <div className="mt-8 flex justify-end">
                <Link
                    href="/products"
                    className="inline-flex items-center gap-1 text-base font-semibold leading-none text-text-primary-strong hover:text-text-primary"
                >
                    {viewMoreLabel}
                    <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                </Link>
            </div>
        </div>
    );
}
