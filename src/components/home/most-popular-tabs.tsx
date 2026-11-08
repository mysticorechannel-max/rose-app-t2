"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useState, useTransition } from "react";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Link } from "@/i18n/navigation";
import { fetchMostPopularProducts } from "@/shared/lib/utils/api";
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
    const [productsByTab, setProductsByTab] = useState<Record<string, Product[]>>({
        [occasions[0]?.id ?? ""]: initialProducts,
    });
    const [isPending, startTransition] = useTransition();

    // Functions
    const handleTabChange = (occasionId: string) => {
        if (occasionId === activeId) return;
        setActiveId(occasionId);

        // Use cached result if already fetched
        if (productsByTab[occasionId]) return;

        startTransition(async () => {
            // Direct fetch — not a Server Action (reads don't need mutations pattern)
            const products = await fetchMostPopularProducts(occasionId, limit);
            setProductsByTab((prev) => ({ ...prev, [occasionId]: products }));
        });
    };

    const currentProducts = productsByTab[activeId] ?? [];

    return (
        <div>
            {/* Header: title left, tabs right — per Figma */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <SectionHeading title={title} />

                {/* DS Tabs component — accessible keyboard nav, RTL-aware */}
                <Tabs
                    value={activeId}
                    onValueChange={handleTabChange}
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

            {/* Grid dims + spinner overlay while fetching */}
            <div className="relative">
                <div className={isPending ? "pointer-events-none opacity-50 transition-opacity duration-200" : undefined}>
                    {currentProducts.length > 0 ? (
                        <ProductGrid products={currentProducts} />
                    ) : (
                        <p className="py-12 text-center text-text-muted">{emptyLabel}</p>
                    )}
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
