import type { Company } from "@/types/product";

// Reusable single strip of partner logos. Shared by the Companies section and
// the area near the Hero — do NOT build a second strip. Pass the companies in
// (from the backend when available, or the static fallback) and this renders
// them in one row.
export function CompaniesStrip({ companies }: { companies: Company[] }) {
    return (
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:justify-between">
            {companies.map((company) => (
                <li key={company.id} className="flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element -- static/remote logo asset */}
                    <img
                        src={company.logo}
                        alt={company.name}
                        className="h-[51px] w-auto grayscale opacity-70 transition hover:opacity-100 hover:grayscale-0"
                    />
                </li>
            ))}
        </ul>
    );
}
