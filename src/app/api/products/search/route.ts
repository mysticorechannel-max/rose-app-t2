import { PRODUCT_ENDPOINTS } from "@/shared/lib/apis/products/products.endpoint";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
      throw new Error("API URL is not configured");
    }

    const searchParams = request.nextUrl.searchParams;

    const url = `${baseUrl}${PRODUCT_ENDPOINTS.SEARCH}?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to search products",
      },
      { status: 500 }
    );
  }
}
