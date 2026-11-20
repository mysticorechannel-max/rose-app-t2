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
                    {/* Track renders its items twice; the animation shifts -50% so the
                        loop is seamless. Pauses on hover and under reduced-motion. */}
                    <ul className="animate-marquee flex w-max items-start gap-6 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
                        {items.map((item) => (
                            <li key={item.id} className="w-80 shrink-0">
                                <TestimonialCard {...item} />
                            </li>
                        ))}

                        {/* Duplicated set — hidden from assistive tech to avoid double reading */}
                        {items.map((item) => (
                            <li key={`clone-${item.id}`} aria-hidden="true" className="w-80 shrink-0">
                                <TestimonialCard {...item} />
                            </li>
                        ))}
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
