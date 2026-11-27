import { NextResponse } from "next/server";

import { isNewProduct } from "@/shared/lib/utils/product";
import type { ApiResponse, PaginatedPayload, Product } from "@/types/product";

const API_BASE_URL = process.env.API_URL;
const DEFAULT_LIMIT = 10;

export async function GET(request: Request): Promise<NextResponse> {
    if (!API_BASE_URL) {
        return NextResponse.json(
            { status: false, code: 500, message: "API_URL is not configured" },
            { status: 500 }
        );
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") ?? String(DEFAULT_LIMIT);

    const upstream = new URL(`${API_BASE_URL}/products`);
    upstream.searchParams.set("sortBy", "bestSelling");
    upstream.searchParams.set("sortOrder", "desc");
    upstream.searchParams.set("limit", limit);

    const response = await fetch(upstream.toString(), {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        return NextResponse.json(
            { status: false, code: response.status, message: "Failed to fetch best selling products" },
            { status: response.status }
        );
    }

    const body = (await response.json()) as ApiResponse<PaginatedPayload<Product>>;

    const nowMs = Date.now();
    const products = body.payload.data.map((product) => ({
        ...product,
        isNew: isNewProduct(product.createdAt, nowMs),
    }));

    return NextResponse.json({
        status: true,
        code: 200,
        payload: products,
    });
}
