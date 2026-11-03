import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { fetchBestSellingProducts } from "@/lib/api";
import { cn } from "@/lib/utils";

import { ProductCarousel } from "./product-carousel";

const BEST_SELLING_LIMIT = 10;

export async function BestSellingSection() {
    // Translation
    const t = await getTranslations("home.bestSelling");

    // Query — a limited set only, never the full catalog.
    const products = await fetchBestSellingProducts(BEST_SELLING_LIMIT);

    if (products.length === 0) return null;

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-6">
                {/* Text column — fixed ~291px per Figma */}
                <div className="flex flex-col gap-2.5 lg:w-[291px] lg:shrink-0">
                    <p className="text-base font-bold uppercase leading-none tracking-[0.25em] text-text-secondary-strong">
                        {t("eyebrow")}
                    </p>
                    <h2 className="text-3xl font-bold leading-tight">
                        <span className="text-text-secondary">{t("word1")} </span>
                        <span className="text-text-primary">{t("word2")} </span>
                        <span className="text-text-secondary">{t("word3")} </span>
                        <span className="text-text-primary">{t("word4")}</span>
                    </h2>
                    <p className="mt-2 text-base font-normal leading-[1.2] text-text-soft">{t("description")}</p>
                    <Link href="/products" className={cn(buttonVariants(), "mt-4 w-fit bg-bg-primary-strong hover:bg-bg-primary")}>
                        {t("cta")}
                        <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                    </Link>
                </div>

                <div className="min-w-0 flex-1">
                    <ProductCarousel products={products} />
                </div>
            </div>
        </section>
    );
}
