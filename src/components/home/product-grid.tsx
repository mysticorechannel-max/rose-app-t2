import { useTranslations } from "next-intl";

import type { Product } from "@/types/product";

import { ProductCard } from "./product-card";

interface ProductGridProps {
    products: Product[];
}

// 3 rows x 4 columns on large screens; fills with whatever the tab returned.
export function ProductGrid({ products }: ProductGridProps) {
    // Translation
    const t = useTranslations("home.mostPopular");

    if (products.length === 0) {
        return <p className="py-12 text-center text-sm text-text-muted">{t("empty")}</p>;
    }

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
