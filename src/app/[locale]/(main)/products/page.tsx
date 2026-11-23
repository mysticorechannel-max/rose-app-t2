import { Suspense } from "react";

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ProductsErrorBoundary } from "./_components/products-error-boundary";
import { ProductsGridSkeleton } from "./_components/products-grid-skeleton";
import { ProductsResults } from "./_components/products-results";
import {
  buildProductsQuery,
  serializeProductsQuery,
  type ProductsSearchParams,
} from "./_utils/products-query.util";
import { ProductsFilters } from "./products-filters";

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<ProductsSearchParams>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });

  return { title: t("metaTitle") };
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  const rawSearchParams = await searchParams;

  // Variables
  const query = buildProductsQuery(rawSearchParams);
  const queryKey = serializeProductsQuery(query);

  return (
    <main className="container mx-auto px-4 py-8 xl:px-0">
      {/* Figma: sidebar 301px (pe 24px + 1px end border → 276px content) + 24px gap + fluid grid */}
      <div className="flex gap-6">
        <div className="w-75.25 shrink-0 border-e border-border-subtle pe-6">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}>
            <ProductsFilters />
          </Suspense>
        </div>

        {/* Keyed on the query so every filter/page change shows the skeleton */}
        <div className="min-w-0 flex-1">
          <ProductsErrorBoundary key={queryKey}>
            <Suspense key={queryKey} fallback={<ProductsGridSkeleton />}>
              <ProductsResults query={query} searchParams={rawSearchParams} locale={locale} />
            </Suspense>
          </ProductsErrorBoundary>
        </div>
      </div>
    </main>
  );
}
