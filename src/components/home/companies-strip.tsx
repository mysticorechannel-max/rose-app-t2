import Image from "next/image";

interface Company {
    id: string;
    name: string;
    logo: string;
}

// Reusable partner-logos strip. Pass the companies array (static or from API).
export function CompaniesStrip({ companies }: { companies: Company[] }) {
    return (
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:justify-between">
            {companies.map((company) => (
                <li key={company.id} className="flex items-center justify-center">
                    <Image
                        src={company.logo}
                        alt={company.name}
                        width={120}
                        height={51}
                        className="h-12 w-auto grayscale opacity-70 transition hover:opacity-100 hover:grayscale-0"
                    />
                </li>
            ))}
        </ul>
    );
}
