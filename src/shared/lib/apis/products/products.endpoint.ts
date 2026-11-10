export const PRODUCT_ENDPOINTS = {
  GET_ALL: "/api/products",
  GET_BY_ID: (id: string) => `/api/products/${id}`,
  SEARCH: "/api/products",
} as const;
