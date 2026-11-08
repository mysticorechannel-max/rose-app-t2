import { getTranslations } from "next-intl/server";

import { fetchMostPopularProducts, fetchOccasions } from "@/shared/lib/utils/api";

import { MostPopularTabs } from "./most-popular-tabs";

const MOST_POPULAR_LIMIT = 12;

export async function MostPopularSection() {
    // Translation
    const t = await getTranslations("home.mostPopular");

    // Fetch all occasions from the API — tabs are built from real data only.
    // Occasions with no ID are filtered out so every tab returns filtered products.
    const allOccasions = await fetchOccasions();
    const occasions = allOccasions.filter((o) => o.id !== "");

    if (occasions.length === 0) return null;

    const initialProducts = await fetchMostPopularProducts(occasions[0].id, MOST_POPULAR_LIMIT);

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
            <MostPopularTabs
                occasions={occasions}
                initialProducts={initialProducts}
                title={t("title")}
                viewMoreLabel={t("viewMore")}
                emptyLabel={t("empty")}
                limit={MOST_POPULAR_LIMIT}
            />
        </section>
    );
}
