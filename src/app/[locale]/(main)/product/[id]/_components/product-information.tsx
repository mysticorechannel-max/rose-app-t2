import { Heart, Package, ShoppingCart, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getProductPricing, isOutOfStock } from "@/shared/lib/utils/product";
import { Button } from "@/shared/ui/button";
import type { Product, ProductDetails } from "@/types/product";

interface ProductInformationProps {
  product: Product | ProductDetails;
}

export default async function ProductInformation({ product }: ProductInformationProps) {
  // Translation
  const t = await getTranslations("home.product");

  // Variables
  const pricing = getProductPricing(product);
  const outOfStock = isOutOfStock(product);

  return (
    <section className="flex min-h-[34rem] flex-col">
      <h1 className="text-3xl font-semibold text-text-plain">{product.title}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {pricing.hasDiscount && (
          <span className="text-2xl font-semibold text-text-muted line-through">
            {pricing.original.toFixed(2)} {t("currency")}
          </span>
        )}
        <span className="text-2xl font-bold text-text-plain">
          {pricing.current.toFixed(2)} {t("currency")}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-bg-muted px-4 py-2 text-sm text-text-default">
          <Package aria-hidden="true" className="size-5 text-text-muted" />
          {outOfStock ? t("outOfStock") : t("stockQuantity", { count: product.stock })}
        </span>
      </div>

      <hr className="my-5 border-border-subtle" />

      <div className="flex items-center gap-2 text-base text-text-plain">
        <Star aria-hidden="true" className="size-5 fill-bg-warning text-bg-warning" />
        <span>{t("ratingValue", { rating: product.rating.toFixed(1) })}</span>
        <span className="text-text-info">
          {t("ratingCountDisplay", { count: product.ratings })}
        </span>
      </div>

      <hr className="my-5 border-border-subtle" />

      <div className="min-h-0 max-h-64 flex-1 overflow-y-auto pe-2 text-text-soft">
        <p className="whitespace-pre-line leading-7">{product.description}</p>
      </div>

      <div className="mt-auto flex shrink-0 gap-3 pt-8">
        <Button
          type="button"
          variant="outline"
          aria-label={t("addToFavorite")}
          className="size-14 rounded-xl border-transparent bg-bg-muted px-0 text-text-plain hover:bg-bg-soft"
        >
          <Heart aria-hidden="true" />
        </Button>
        <Button type="button" variant="destructive" disabled={outOfStock} className="h-14 flex-1 rounded-xl">
          <ShoppingCart aria-hidden="true" />
          {t("addToCart")}
        </Button>
      </div>
    </section>
  );
}
