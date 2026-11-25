"use client";

import { catchError, type ErrorInfo } from "next/error";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";

function ProductsErrorState({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("products");

  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="text-text-muted">{t("loadError")}</p>
      <Button type="button" onClick={onRetry}>
        {t("retry")}
      </Button>
    </div>
  );
}

// Grid-level boundary: retry() re-fetches the grid while the filters stay usable
function renderProductsError(_props: object, { retry }: ErrorInfo): React.ReactNode {
  return <ProductsErrorState onRetry={retry} />;
}

export const ProductsErrorBoundary = catchError(renderProductsError);
