export interface Product {
  id: string;
  title: string;
  description: string;
  cover: string;
  gallery: string;
  price: string;

  discountType: "PERCENT" | "FIXED" | null;
  discountValue: string | null;

  rating: number;
  ratings: number;
  stock: number;

  categoryId: string;
  category: {
    id: string;
    title: string;
  };

  subCategoryId: string;
  subCategory: {
    id: string;
    title: string;
  };

  occasions: {
    id: string;
    productId: string;
    [key: string]: unknown;
  }[];

  immutable: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  _count: {
    reviews: number;
    cartItems: number;
    wishlistItems: number;
    orderItems: number;
  };
}

export interface ProductSearchParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  total: number;
}

export interface ProductResponse {
  status: boolean;
  code: number;
  payload: {
    data: Product[];
    metadata: ProductMetadata;
  };
}
