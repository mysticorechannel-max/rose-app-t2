import type { Product } from "@/types/product";

export interface ProductPricing {
    current: number;
    original: number;
    hasDiscount: boolean;
}

// Prices arrive as strings; discounts as PERCENT or FIXED off the base price.
export function getProductPricing(product: Product): ProductPricing {
    const original = Number(product.price) || 0;
    const value = Number(product.discountValue) || 0;

    if (!product.discountType || value <= 0) {
        return { current: original, original, hasDiscount: false };
    }

    const current =
        product.discountType === "PERCENT"
            ? original - (original * value) / 100
            : original - value;

    return { current: Math.max(current, 0), original, hasDiscount: true };
}

export function isOutOfStock(product: Product): boolean {
    return product.stock <= 0;
}

// `gallery` is stored as a JSON-encoded string of image URLs.
export function parseGallery(gallery: string): string[] {
    try {
        const parsed = JSON.parse(gallery);
        return Array.isArray(parsed) ? parsed.filter((url) => typeof url === "string") : [];
    } catch {
        return [];
    }
}
