import { getTranslations } from "next-intl/server";

// Fully static per the task spec — no API integration required.
// Images are team-provided under /public/images/gallery and match the Figma
// bento layout: three columns, each with a short tile and a tall tile.
const tiles = [
    { src: "wedding-boxes", span: "tall" },
    { src: "roses-chocolate", span: "short" },
    { src: "red-gift-rings", span: "short" },
    { src: "ring-roses", span: "tall" },
    { src: "ring-daisy", span: "short" },
    { src: "engagement-card", span: "tall" },
] as const;

export async function GallerySection() {
    // Translation
    const t = await getTranslations("home.gallery");

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
            <div className="mb-8 text-center">
                <p className="text-base font-bold uppercase leading-none tracking-[0.25em] text-text-secondary-strong">
                    {t("eyebrow")}
                </p>
                <h2 className="mt-2 inline-block text-4xl font-bold leading-none text-text-primary-strong">
                    <span className="relative isolate inline-block">
                        {/* Band covers bottom ~62% of text height, rounded right only */}
                        <span
                            aria-hidden="true"
                            className="absolute -bottom-3 left-0 z-[-1] h-[62%] w-[72%] rounded-r-[40px] bg-bg-heading-band"
                        />
                        {/* Darker pink underline — sits just below the band */}
                        <span
                            aria-hidden="true"
                            className="absolute -bottom-3 left-0 z-[-1] h-[4px] w-[55%] bg-bg-heading-underline"
                        />
                        {t("title")}
                    </span>
                </h2>
            </div>

            {/* Bento grid — three columns, each with a short + tall tile (per Figma).
                Column 1 is tall-then-short; columns 2 and 3 are short-then-tall. */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {/* Column 1 — tall on top, short below */}
                <div className="flex flex-col gap-3">
                    <GalleryTile tile={tiles[0]} alt={t("imageAlt")} />
                    <GalleryTile tile={tiles[1]} alt={t("imageAlt")} />
                </div>

                {/* Column 2 — short on top, tall below */}
                <div className="flex flex-col gap-3">
                    <GalleryTile tile={tiles[2]} alt={t("imageAlt")} />
                    <GalleryTile tile={tiles[3]} alt={t("imageAlt")} />
                </div>

                {/* Column 3 — short on top, tall below */}
                <div className="flex flex-col gap-3">
                    <GalleryTile tile={tiles[4]} alt={t("imageAlt")} />
                    <GalleryTile tile={tiles[5]} alt={t("imageAlt")} />
                </div>
            </div>
        </section>
    );
}

function GalleryTile({ tile, alt }: { tile: (typeof tiles)[number]; alt: string }) {
    // Tall tiles are taller than short tiles, matching the Figma 611/617 vs 406/411 ratio.
    const heightClass = tile.span === "tall" ? "h-[617px]" : "h-[406px]";

    return (
        <div className={`overflow-hidden bg-bg-muted ${heightClass}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static public asset */}
            <img src={`/images/gallery/${tile.src}.svg`} alt={alt} className="h-full w-full object-cover" />
        </div>
    );
}
