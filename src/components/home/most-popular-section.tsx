import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { fetchMostPopularProducts, fetchOccasions } from "@/shared/lib/utils/api";

import { MostPopularTabs } from "./most-popular-tabs";

const MOST_POPULAR_LIMIT = 12;

export async function MostPopularSection() {
    // Translation
    const t = await getTranslations("home.mostPopular");

    // Query — occasions drive the tabs; first tab's 12 products render on load.
    const occasions = await fetchOccasions();

    if (occasions.length === 0) return null;

    const initialProducts = await fetchMostPopularProducts(occasions[0].id, MOST_POPULAR_LIMIT);

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
            <MostPopularTabs
                occasions={occasions}
                initialProducts={initialProducts}
                title={t("title")}
                viewMoreLabel={t("viewMore")}
            />
        </section>
    );
}
