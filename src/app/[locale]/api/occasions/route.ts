import { NextRequest } from "next/server";
import { getOccasions } from "@/shared/lib/apis/product-filter/occasions/ossasion.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const result = await getOccasions({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 20,
      search: searchParams.get("search") || undefined,
    });

    return Response.json(result);
  } catch (error) {
    console.error("Error in occasions API route:", error);
    return Response.json(
      { status: false, code: 500, message: "Failed to fetch occasions" },
      { status: 500 }
    );
  }
}
