
import "server-only";

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function GET(request: NextRequest) {
  try {
    if (!API_URL) {
      return NextResponse.json(
        { message: "API_URL is not configured" },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const params = new URLSearchParams({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
    });

    const search = searchParams.get("search")?.trim();

    if (search) {
      params.set("search", search);
    }

    const response = await fetch(
      `${API_URL}/api/occasions?${params.toString()}`,
      { cache: "no-store" }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch occasions" },
      { status: 500 }
    );
  }
}
