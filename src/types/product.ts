// Shapes returned by the Rose App backend (api-docs OpenAPI 3.0).
// Only the fields consumed by the Home page sections are typed here.

export type DiscountType = "PERCENT" | "FIXED" | null;

export interface ProductCategory {
    id: string;
    title: string;
}

export interface Occasion {
    id: string;
    title: string;
    description: string | null;
    image: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ProductCounts {
    reviews: number;
    cartItems: number;
    wishlistItems: number;
    orderItems: number;
}

// `price` and `discountValue` arrive as strings; `gallery` as a JSON string.
export interface Product {
    id: string;
    title: string;
    description: string;
    rating: number;
    ratings: number;
    stock: number;
    price: string;
    discountType: DiscountType;
    discountValue: string | null;
    cover: string;
    gallery: string;
    categoryId: string;
    subCategoryId: string | null;
    createdAt: string;
    updatedAt: string;
    category: ProductCategory | null;
    subCategory: ProductCategory | null;
    occasions: { occasion: Occasion }[];
    _count: ProductCounts;
}

export interface PaginationMetadata {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Envelope used by every endpoint: { status, code, payload }.
export interface ApiResponse<T> {
    status: boolean;
    code: number;
    message?: string;
    payload: T;
}

export interface PaginatedPayload<T> {
    data: T[];
    metadata: PaginationMetadata;
}
