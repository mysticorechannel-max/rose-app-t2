
import { Suspense } from "react";

import { ProductsFilters } from "./products-filters";

export default function ProductsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <div className="w-72 shrink-0">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}>
            <ProductsFilters />
          </Suspense>
        </div>

        <div className="min-w-0 flex-1">
          {/* Products Grid - handled by the other teammate */}
        </div>
      </div>
    </main>
  );
}
