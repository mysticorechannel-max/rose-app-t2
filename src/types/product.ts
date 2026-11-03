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

// Partner company shown in the "Trusted by" strip (Hero + Companies section).
// The backend endpoint is not available yet; the shape below is the expected
// contract so the fetch can be wired up without touching the component.
export interface Company {
    id: string;
    name: string;
    logo: string;
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
