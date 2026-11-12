import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { getProductPricing, isOutOfStock } from "@/shared/lib/utils/product";
import { cn } from "@/shared/lib/utils/tailwindcn.utils";
import type { Product } from "@/types/product";

import { RatingStars } from "./rating-stars";

interface ProductCardProps {
    product: Product;
    isNew?: boolean;
}

const HOT_ORDER_THRESHOLD = 20;

export function ProductCard({ product, isNew = false }: ProductCardProps) {
    // Translation
    const t = useTranslations("home.product");

    // Variables
    const pricing = getProductPricing(product);
    const outOfStock = isOutOfStock(product);
    const isHot = product._count.orderItems >= HOT_ORDER_THRESHOLD;

    return (
        <article className="group flex flex-col gap-4">
            {/* Cover image — fixed height per Figma, radius 16px */}
            <div className="product-cover relative h-68 overflow-hidden rounded-2xl bg-bg-muted">
                <Image
                    src={product.cover}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 45vw, 30vw"
                    className={cn(
                        "product-cover-img object-cover transition-transform duration-300",
                        outOfStock && "opacity-80"
                    )}
                />

                {/* Badges — top corners */}
                <div className="pointer-events-none absolute inset-x-2 top-2 flex items-start justify-between">
                    <span>
                        {isNew && (
                            <span className="inline-flex items-center gap-2.5 rounded-full bg-bg-muted px-2 py-0.5 text-xs font-medium text-text-plain">
                                {t("new")}
                            </span>
                        )}
                    </span>
                    <span className="flex gap-1.5">
                        {isHot && (
                            <span className="inline-flex items-center gap-2.5 rounded-full bg-bg-primary-fixed-fade px-2 py-0.5 text-xs font-medium text-text-primary-fixed">
                                {t("hot")}
                            </span>
                        )}
                        {outOfStock && (
                            <span className="inline-flex items-center gap-2.5 rounded-full bg-bg-danger px-2 py-0.5 text-xs font-medium text-text-inverse">
                                {t("outOfStock")}
                            </span>
                        )}
                    </span>
                </div>

                {/* Hover overlay — quick actions */}
                <div className="product-cover-overlay absolute inset-0 flex items-center justify-center gap-2.5 bg-bg-secondary-saturated/50">
                    <button type="button" aria-label={t("addToFavorite")} className="transition-transform hover:scale-110">
                        <Image src="/icons/heart.svg" alt="" aria-hidden="true" width={30} height={30} />
                    </button>
                    <button type="button" aria-label={t("preview")} className="transition-transform hover:scale-110">
                        <Image src="/icons/eye.svg" alt="" aria-hidden="true" width={30} height={30} />
                    </button>
                </div>
            </div>

            {/* Info row */}
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-semibold text-text-primary-strong">{product.title}</h3>
                    <RatingStars value={product.rating} className="mt-1" />
                    <p className="mt-1 flex items-center gap-2 text-sm">
                        <span className="font-semibold text-text-primary-strong">
                            {Number(pricing.current).toFixed(2)} {t("currency")}
                        </span>
                        {pricing.hasDiscount && (
                            <span className="text-xs text-text-muted line-through">
                                {Number(pricing.original).toFixed(2)} {t("currency")}
                            </span>
                        )}
                    </p>
                </div>

                <button
                    type="button"
                    aria-label={t("addToCart")}
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-bg-primary-fixed text-text-inverse transition-opacity hover:opacity-90"
                >
                    <ShoppingCart className="size-4" aria-hidden="true" />
                </button>
            </div>
        </article>
    );
}
