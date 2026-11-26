"use client";

import { ImageOff } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

import { parseGallery } from "@/shared/lib/utils/product";
import { cn } from "@/shared/lib/utils/tailwindcn.utils";
import type { Product, ProductDetails } from "@/types/product";

const REMOTE_IMAGE_ORIGIN = "https://rose-app.elevate-bootcamp.cloud";
const REMOTE_IMAGE_PATHS = ["/storage/", "/api/upload/"] as const;

interface ProductImageGalleryProps {
  product: Product | ProductDetails;
}

function isAllowedImageSource(source: string): boolean {
  const normalizedSource = source.trim();

  if (!normalizedSource || normalizedSource.includes("\\")) return false;
  if (normalizedSource.startsWith("/")) return !normalizedSource.startsWith("//");

  try {
    const imageUrl = new URL(normalizedSource);

    return (
      imageUrl.origin === REMOTE_IMAGE_ORIGIN &&
      REMOTE_IMAGE_PATHS.some((path) => imageUrl.pathname.startsWith(path))
    );
  } catch {
    return false;
  }
}

function getProductImageSources(product: Product | ProductDetails): string[] {
  const gallerySources =
    typeof product.gallery === "string" ? parseGallery(product.gallery) : [];
  const sourceCandidates = [product.cover, ...gallerySources].filter(
    (source): source is string => typeof source === "string"
  );

  return [...new Set(sourceCandidates)]
    .map((source) => source.trim())
    .filter(isAllowedImageSource);
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  // Translation
  const t = useTranslations("home.product");

  // State
  const [selectedImageSource, setSelectedImageSource] = useState<string | null>(null);
  const [failedImageSources, setFailedImageSources] = useState<string[]>([]);

  // Variables
  const images = getProductImageSources(product).filter(
    (source) => !failedImageSources.includes(source)
  );
  const selectedImage = images.find((source) => source === selectedImageSource) ?? images[0];

  // Functions
  const handleImageError = (source: string) => {
    setFailedImageSources((failedSources) =>
      failedSources.includes(source) ? failedSources : [...failedSources, source]
    );
  };

  return (
    <section aria-label={product.title} className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-bg-muted">
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={product.title}
            fill
            priority
            sizes="50vw"
            onError={() => handleImageError(selectedImage)}
            className="object-contain"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-text-muted">
            <ImageOff aria-hidden="true" className="size-10" />
          </div>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            aria-label={t("selectImage", { number: index + 1 })}
            aria-pressed={selectedImage === image}
            onClick={() => setSelectedImageSource(image)}
            className={cn(
              "relative size-20 shrink-0 overflow-hidden rounded-lg border-2 bg-bg-muted",
              selectedImage === image ? "border-border-primary" : "border-border-soft"
            )}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="80px"
              onError={() => handleImageError(image)}
              className="object-contain"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
