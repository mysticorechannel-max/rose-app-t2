import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { SectionHeading } from "@/shared/components/section-heading";

import { RatingStars } from "./rating-stars";

// Static testimonials — images are team-provided under /public/images/testimonials.
const TESTIMONIALS = [
    { id: "one", image: "/images/testimonials/customer-1.webp" },
    { id: "two", image: "/images/testimonials/customer-2.webp" },
    { id: "three", image: "/images/testimonials/customer-3.webp" },
] as const;

// Two identical groups for the -50% loop; each repeats the set so it fills ultra-wide screens.
const GROUPS = [0, 1] as const;
const REPEATS = [0, 1, 2] as const;

interface Testimonial {
    id: string;
    image: string;
    name: string;
    date: string;
    quote: string;
}

export async function TestimonialsSection() {
    // Translation
    const t = await getTranslations("home.testimonials");

    // Variables
    const items: Testimonial[] = TESTIMONIALS.map(({ id, image }) => ({
        id,
        image,
        name: t(`items.${id}.name`),
        date: t(`items.${id}.date`),
        quote: t(`items.${id}.quote`),
    }));

    return (
        <section className="w-full py-12">
            <div className="mx-auto mb-8 w-full max-w-7xl px-4 text-center sm:px-6">
                <SectionHeading eyebrow={t("eyebrow")} title={t("title")} center />
            </div>

            {/* Full-width band — continuous, gentle, infinite marquee (no carousel library) */}
            <div className="w-full overflow-hidden bg-bg-testimonials-band pb-12 pt-16">
                <div className="group relative w-full">
                    {/* Track = two identical groups; the animation shifts -50% (one full group)
                        so the loop is seamless. Spacing lives inside each item (not a flex gap)
                        so a group's width is exact. Pauses on hover and under reduced-motion. */}
                    <ul className="animate-marquee flex w-max items-start group-hover:[animation-play-state:paused] motion-reduce:animate-none">
                        {GROUPS.map((group) =>
                            REPEATS.map((repeat) =>
                                items.map((item) => (
                                    <li
                                        key={`${group}-${repeat}-${item.id}`}
                                        aria-hidden={group === 0 && repeat === 0 ? undefined : true}
                                        className="w-72 shrink-0 px-3 sm:w-80"
                                    >
                                        <TestimonialCard {...item} />
                                    </li>
                                )),
                            ),
                        )}
                    </ul>
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({ name, date, quote, image }: Omit<Testimonial, "id">) {
    return (
        <figure className="relative mt-12 flex w-full flex-col items-center gap-3 rounded-3xl bg-bg-testimonials-card px-5 pb-5 pt-14 text-center">
            {/* Avatar — circular, overlapping the top edge of the card */}
            <div className="absolute -top-12 left-1/2 size-24 -translate-x-1/2 overflow-hidden rounded-full border-4 border-bg-testimonials-card bg-bg-muted">
                <Image src={image} alt={name} width={96} height={96} className="size-full object-cover" />
            </div>

            <figcaption className="text-base font-bold text-text-on-elevated">{name}</figcaption>
            <RatingStars value={5} />
            <blockquote className="text-base font-medium leading-snug text-text-on-elevated-soft">{quote}</blockquote>
            <p className="text-xs text-text-on-elevated-muted">{date}</p>
        </figure>
    );
}
