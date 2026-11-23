import { PRODUCTS_PAGE_SIZE } from "@/shared/lib/constants/products.constant";

export type ProductsSearchParams = Record<string, string | string[] | undefined>;

export interface ProductsQuery {
  page: number;
  limit: number;
  categoryId?: string;
  subCategoryId?: string;
  occasionId?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface FirstPageHref {
  pathname: "/products";
  query: Record<string, string>;
}

type TextFilterKey = "categoryId" | "subCategoryId" | "occasionId";

const TEXT_FILTER_KEYS: readonly TextFilterKey[] = ["categoryId", "subCategoryId", "occasionId"];

// Only values the API accepts (GET /api/products); anything else is dropped
const SORT_BY_VALUES = ["title", "price", "rating", "createdAt", "bestSelling", "mostPopular"];
const SORT_ORDER_VALUES = ["asc", "desc"];

// Stable key order used by serializeProductsQuery
const QUERY_KEY_ORDER: readonly (keyof ProductsQuery)[] = [
  "page",
  "limit",
  "categoryId",
  "subCategoryId",
  "occasionId",
  "minPrice",
  "maxPrice",
  "minRating",
  "sortBy",
  "sortOrder",
];

function getFirstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getTrimmedText(value: string | string[] | undefined): string | undefined {
  const trimmed = getFirstValue(value)?.trim();

  return trimmed ? trimmed : undefined;
}

function getNonNegativeNumberText(value: string | string[] | undefined): string | undefined {
  const trimmed = getTrimmedText(value);
  if (trimmed === undefined) return undefined;

  const parsed = Number(trimmed);

  return Number.isFinite(parsed) && parsed >= 0 ? trimmed : undefined;
}

function getPositiveInteger(value: string | string[] | undefined, fallback: number): number {
  const trimmed = getTrimmedText(value);
  if (trimmed === undefined) return fallback;

  const parsed = Number(trimmed);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function buildProductsQuery(
  searchParams: ProductsSearchParams,
  pageSize: number = PRODUCTS_PAGE_SIZE
): ProductsQuery {
  const query: ProductsQuery = {
    page: getPositiveInteger(searchParams.page, 1),
    limit: getPositiveInteger(searchParams.limit, pageSize),
  };

  // Text filters: first value, trimmed, omitted if empty
  for (const key of TEXT_FILTER_KEYS) {
    const value = getTrimmedText(searchParams[key]);
    if (value !== undefined) query[key] = value;
  }

  // Sort: pass through only allowed values
  const sortBy = getTrimmedText(searchParams.sortBy);
  const sortOrder = getTrimmedText(searchParams.sortOrder);

  if (sortBy !== undefined && SORT_BY_VALUES.includes(sortBy)) query.sortBy = sortBy;
  if (sortOrder !== undefined && SORT_ORDER_VALUES.includes(sortOrder)) query.sortOrder = sortOrder;

  // Numeric filters: finite and >= 0, sent as the trimmed original string
  const minPrice = getNonNegativeNumberText(searchParams.minPrice);
  const maxPrice = getNonNegativeNumberText(searchParams.maxPrice);
  const minRating = getNonNegativeNumberText(searchParams.rating);

  if (minPrice !== undefined) query.minPrice = minPrice;
  if (maxPrice !== undefined) query.maxPrice = maxPrice;
  if (minRating !== undefined) query.minRating = minRating;

  return query;
}

export function serializeProductsQuery(query: ProductsQuery): string {
  const params = new URLSearchParams();

  for (const key of QUERY_KEY_ORDER) {
    const value = query[key];
    if (value !== undefined) params.set(key, String(value));
  }

  return params.toString();
}

export function shouldResetPage(page: number, totalPages: number): boolean {
  return totalPages >= 1 && page > totalPages;
}

export function buildFirstPageHref(searchParams: ProductsSearchParams): FirstPageHref {
  const query: Record<string, string> = {};

  for (const [key, value] of Object.entries(searchParams)) {
    const firstValue = getFirstValue(value);
    if (firstValue !== undefined) query[key] = firstValue;
  }

  query.page = "1";

  return { pathname: "/products", query };
}
