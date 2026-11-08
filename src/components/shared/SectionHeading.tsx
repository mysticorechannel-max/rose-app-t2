import { cn } from "@/shared/lib/utils/tailwindcn.utils";

interface SectionHeadingProps {
    eyebrow?: string;
    title: string;
    center?: boolean;
    className?: string;
}

/**
 * Reusable section heading — eyebrow label + decorated h2 title.
 * Used across Gallery, Testimonials, Most Popular, and similar sections.
 */
export function SectionHeading({
    eyebrow,
    title,
    center = false,
    className,
}: SectionHeadingProps) {
    return (
        <div className={cn(center && "text-center", className)}>
            {eyebrow && (
                <p className="text-base font-bold uppercase leading-none tracking-[0.25em] text-text-secondary-strong">
                    {eyebrow}
                </p>
            )}

            <h2
                className={cn(
                    "mt-2 text-4xl font-bold leading-none text-text-primary-strong",
                    center && "inline-block"
                )}
            >
                <span className="relative isolate inline-block">
                    {/* Decorative band behind the title */}
                    <span
                        aria-hidden="true"
                        className="absolute -bottom-3 left-0 z-[-1] h-[62%] w-[72%] rounded-r-[40px] bg-bg-heading-band"
                    />
                    {/* Decorative underline */}
                    <span
                        aria-hidden="true"
                        className="absolute -bottom-3 left-0 z-[-1] h-1 w-[55%] bg-bg-heading-underline"
                    />
                    {title}
                </span>
            </h2>
        </div>
    );
}
