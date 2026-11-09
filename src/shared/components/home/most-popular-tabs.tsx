"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

import { SectionHeading } from "@/shared/components/section-heading";
import { useMostPopularProducts } from "@/shared/hooks/products/use-most-popular-products";
import { Link } from "@/i18n/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import type { Occasion, Product } from "@/types/product";

import { ProductGrid } from "./product-grid";

interface MostPopularTabsProps {
    occasions: Occasion[];
    initialProducts: Product[];
    title: string;
    viewMoreLabel: string;
    emptyLabel: string;
    limit: number;
}

export function MostPopularTabs({
    occasions,
    initialProducts,
    title,
    viewMoreLabel,
    emptyLabel,
    limit,
}: MostPopularTabsProps) {
    // Navigation
    const locale = useLocale();

    // State
    const [activeId, setActiveId] = useState(occasions[0]?.id ?? "");

    // Query — initialData seeds the first tab fetched on the server.
    const { data: products = [], isFetching } = useMostPopularProducts({
        occasionId: activeId,
        limit,
        initialData: activeId === occasions[0]?.id ? initialProducts : undefined,
    });

    return (
        <div>
            {/* Header: title left, tabs right — per Figma */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <SectionHeading title={title} />

                {/* DS Tabs component — accessible keyboard nav, RTL-aware */}
                <Tabs
                    value={activeId}
                    onValueChange={setActiveId}
                    dir={locale === "ar" ? "rtl" : "ltr"}
                >
                    <TabsList>
                        {occasions.map((occasion) => (
                            <TabsTrigger key={occasion.id} value={occasion.id}>
                                {occasion.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {/* Grid with spinner overlay while fetching */}
            <div className="relative">
                <div
                    className={
                        isFetching
                            ? "pointer-events-none opacity-50 transition-opacity duration-200"
                            : undefined
                    }
                >
                    {products.length > 0 ? (
                        <ProductGrid products={products} />
                    ) : (
                        <p className="py-12 text-center text-text-muted">{emptyLabel}</p>
                    )}
                </div>

                {isFetching && (
                    <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-20">
                        <Loader2
                            className="size-8 animate-spin text-text-primary-strong"
                            aria-hidden="true"
                        />
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
