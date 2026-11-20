import { NextResponse } from "next/server";

import { isNewProduct } from "@/shared/lib/utils/product";
import type { ApiResponse, PaginatedPayload, Product } from "@/types/product";

// Server-only API host — never exposed to the browser.
const API_BASE_URL = process.env.API_URL;

const DEFAULT_LIMIT = 12;

export async function GET(request: Request): Promise<NextResponse> {
    if (!API_BASE_URL) {
        return NextResponse.json(
            { error: "API_URL is not configured" },
            { status: 500 }
        );
    }

    const { searchParams } = new URL(request.url);
    const occasionId = searchParams.get("occasionId") ?? undefined;
    const limit = searchParams.get("limit") ?? String(DEFAULT_LIMIT);

    const upstream = new URL(`${API_BASE_URL}/products`);
    upstream.searchParams.set("sortBy", "mostPopular");
    upstream.searchParams.set("sortOrder", "desc");
    upstream.searchParams.set("limit", limit);
    if (occasionId) upstream.searchParams.set("occasionId", occasionId);

    const response = await fetch(upstream.toString(), {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        return NextResponse.json(
            { error: "Failed to fetch most popular products" },
            { status: response.status }
        );
    }

    const body = (await response.json()) as ApiResponse<PaginatedPayload<Product>>;

    // Tag with server-computed isNew so the client never calls Date.now() in render.
    const nowMs = Date.now();
    const products = body.payload.data.map((product) => ({
        ...product,
        isNew: isNewProduct(product.createdAt, nowMs),
    }));

    return NextResponse.json(products);
}
