import { redirect } from "@/i18n/navigation";
import { PRODUCTS_PAGE_SIZE } from "@/shared/lib/constants/products.constant";
import { fetchProductsPage } from "@/shared/lib/utils/api";
import { PaginationControls } from "@/shared/ui/pagination";

import {
  buildFirstPageHref,
  shouldResetPage,
  type ProductsQuery,
  type ProductsSearchParams,
} from "../_utils/products-query.util";
import { ProductsEmptyState } from "./products-empty-state";
import { ProductsGrid } from "./products-grid";

interface ProductsResultsProps {
  query: ProductsQuery;
  searchParams: ProductsSearchParams;
  locale: string;
}

export async function ProductsResults({ query, searchParams, locale }: ProductsResultsProps) {
  // Errors propagate to ProductsErrorBoundary
  const { data, metadata } = await fetchProductsPage({ ...query });

  // Page past the end (e.g. after filters shrank the list): go back to page 1
  if (shouldResetPage(query.page, metadata.totalPages)) {
    redirect({ href: buildFirstPageHref(searchParams), locale });
  }

  if (data.length === 0) return <ProductsEmptyState />;

  return (
    <>
      <ProductsGrid products={data} />
      <PaginationControls
        totalItems={metadata.total}
        defaultLimit={PRODUCTS_PAGE_SIZE}
        className="mt-10"
      />
    </>
  );
}
