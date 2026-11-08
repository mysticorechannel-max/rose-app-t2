import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { SectionHeading } from "@/components/shared/SectionHeading";

import { RatingStars } from "./rating-stars";

// Static testimonials — images are team-provided under /public/images/testimonials.
const TESTIMONIALS = [
    { id: "one", image: "/images/testimonials/customer-1.webp" },
    { id: "two", image: "/images/testimonials/customer-2.webp" },
    { id: "three", image: "/images/testimonials/customer-3.webp" },
] as const;

export async function TestimonialsSection() {
    // Translation
    const t = await getTranslations("home.testimonials");

    const items = TESTIMONIALS.map(({ id, image }) => ({
        id,
        image,
        name: t(`items.${id}.name`),
        date: t(`items.${id}.date`),
        quote: t(`items.${id}.quote`),
    }));

    return (
        <section className="w-full py-12">
            <div className="mx-auto mb-8 w-full max-w-7xl px-4 text-center sm:px-6">
                <SectionHeading
                    eyebrow={t("eyebrow")}
                    title={t("title")}
                    center
                />
            </div>

            {/* Full-width band — static 3-column grid, no carousel */}
            <div className="w-full bg-bg-testimonials-band pb-12 pt-16">
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 justify-items-center gap-6 px-4 sm:px-6 md:grid-cols-3">
                    {items.map((item) => (
                        <TestimonialCard key={item.id} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({
    name,
    date,
    quote,
    image,
}: {
    name: string;
    date: string;
    quote: string;
    image: string;
}) {
    return (
        <figure className="relative mt-12 flex w-full max-w-sm flex-col items-center gap-3 rounded-3xl bg-bg-elevated px-5 pb-5 pt-14 text-center">
            {/* Avatar — circular, overlapping the top edge of the card */}
            <div className="absolute -top-12 left-1/2 size-24 -translate-x-1/2 overflow-hidden rounded-full border-4 border-bg-elevated bg-bg-muted">
                <Image
                    src={image}
                    alt={name}
                    width={96}
                    height={96}
                    className="size-full object-cover"
                />
            </div>

            <figcaption className="text-base font-bold text-text-on-elevated">{name}</figcaption>
            <RatingStars value={5} />
            <blockquote className="text-base font-medium leading-snug text-text-on-elevated-soft">{quote}</blockquote>
            <p className="text-xs text-text-on-elevated-muted">{date}</p>
        </figure>
    );
}
