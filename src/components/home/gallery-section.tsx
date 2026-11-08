import { getTranslations } from "next-intl/server";
import Image from "next/image";

// Fully static — images are team-provided under /public/images/gallery.
// Bento layout: three columns, each with a short tile and a tall tile (per Figma).
const tiles = [
    { src: "wedding-boxes.webp", span: "tall" },
    { src: "roses-chocolate.webp", span: "short" },
    { src: "red-gift-rings.webp", span: "short" },
    { src: "ring-roses.webp", span: "tall" },
    { src: "ring-daisy.webp", span: "short" },
    { src: "engagement-card.webp", span: "tall" },
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
                        <span
                            aria-hidden="true"
                            className="absolute -bottom-3 left-0 z-[-1] h-[62%] w-[72%] rounded-r-[40px] bg-bg-heading-band"
                        />
                        <span
                            aria-hidden="true"
                            className="absolute -bottom-3 left-0 z-[-1] h-1 w-[55%] bg-bg-heading-underline"
                        />
                        {t("title")}
                    </span>
                </h2>
            </div>

            {/* Bento grid — three columns */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-3">
                    <GalleryTile tile={tiles[0]} alt={t("imageAlt")} />
                    <GalleryTile tile={tiles[1]} alt={t("imageAlt")} />
                </div>
                <div className="flex flex-col gap-3">
                    <GalleryTile tile={tiles[2]} alt={t("imageAlt")} />
                    <GalleryTile tile={tiles[3]} alt={t("imageAlt")} />
                </div>
                <div className="flex flex-col gap-3">
                    <GalleryTile tile={tiles[4]} alt={t("imageAlt")} />
                    <GalleryTile tile={tiles[5]} alt={t("imageAlt")} />
                </div>
            </div>
        </section>
    );
}

function GalleryTile({ tile, alt }: { tile: (typeof tiles)[number]; alt: string }) {
    // Tall tiles are taller than short tiles, matching the Figma 3:2 ratio.
    const heightClass = tile.span === "tall" ? "aspect-[3/4]" : "aspect-[4/3]";

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-bg-muted ${heightClass}`}>
            <Image
                src={`/images/gallery/${tile.src}`}
                alt={alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                style={{ borderRadius: "inherit" }}
            />
        </div>
    );
}
