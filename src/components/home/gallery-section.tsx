import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { SectionHeading } from "@/components/shared/SectionHeading";

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
            <SectionHeading
                eyebrow={t("eyebrow")}
                title={t("title")}
                center
                className="mb-8"
            />

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
