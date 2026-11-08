import { getTranslations } from "next-intl/server";

import { fetchCompanies } from "@/shared/lib/utils/api";
import type { Company } from "@/types/product";

import { CompaniesStrip } from "./companies-strip";

// Static fallback logos (team-provided under /public/images/companies). Used
// until the backend companies endpoint ships — fetchCompanies returns null on
// failure, so the strip always has data to render.
const FALLBACK_COMPANIES: Company[] = [
    { id: "coconut", name: "Coconut", logo: "/images/companies/coconut.svg" },
    { id: "ginyard", name: "Ginyard", logo: "/images/companies/ginyard.svg" },
    { id: "lingoude", name: "Lingoude", logo: "/images/companies/lingoude.svg" },
    { id: "velvet", name: "Velvet", logo: "/images/companies/velvet.svg" },
    { id: "ingoude", name: "Ingoude", logo: "/images/companies/ingoude.svg" },
    { id: "habus", name: "Habus", logo: "/images/companies/habus.svg" },
];

export async function CompaniesSection() {
    // Translation
    const t = await getTranslations("home.companies");

    // Query — real data when the endpoint exists, static logos otherwise.
    const companies = (await fetchCompanies()) ?? FALLBACK_COMPANIES;

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
            {/* Pink card (maroon-50 in light, zinc-700 in dark), rounded 20px, with a dotted divider under the heading. */}
            <div className="flex flex-col gap-10 rounded-[20px] bg-bg-companies-card px-6 py-10">
                <h2 className="text-center text-4xl font-bold leading-none text-text-primary-strong">
                    {t.rich("title", {
                        highlight: (chunks) => (
                            // Highlight is soft-pink per Figma: text-secondary-strong → soft-pink-500 (#FF668B) in light.
                            <span className="text-text-secondary-strong">{chunks}</span>
                        ),
                    })}
                </h2>

                <CompaniesStrip companies={companies} />
            </div>
        </section>
    );
}
