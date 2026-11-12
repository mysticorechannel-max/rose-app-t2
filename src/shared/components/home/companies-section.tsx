import { getTranslations } from "next-intl/server";

import { CompaniesStrip } from "./companies-strip";

// Static partner logos (team-provided under /public/images/companies).
// NOTE: The backend /companies endpoint does not exist yet. Using static data
// for now — confirmed with mentor required before wiring up the real API.
const STATIC_COMPANIES = [
    { id: "coconut", name: "Coconut", logo: "/images/companies/coconut.svg" },
    { id: "ginyard", name: "Ginyard", logo: "/images/companies/ginyard.svg" },
    { id: "lingoude", name: "Lingoude", logo: "/images/companies/lingoude.svg" },
    { id: "velvet", name: "Velvet", logo: "/images/companies/velvet.svg" },
    { id: "ingoude", name: "Ingoude", logo: "/images/companies/ingoude.svg" },
    { id: "habus", name: "Habus", logo: "/images/companies/habus.svg" },
] as const;

export async function CompaniesSection() {
    // Translation
    const t = await getTranslations("home.companies");

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
            <div className="flex flex-col gap-10 rounded-[20px] bg-bg-companies-card px-6 py-10">
                <h2 className="text-center text-4xl font-bold leading-none text-text-primary-strong">
                    {t.rich("title", {
                        highlight: (chunks) => (
                            <span className="text-text-secondary-strong">{chunks}</span>
                        ),
                    })}
                </h2>

                <CompaniesStrip companies={[...STATIC_COMPANIES]} />
            </div>
        </section>
    );
}
