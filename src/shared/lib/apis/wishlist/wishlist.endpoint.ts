export const WISHLIST_ENDPOINTS = {
  GET_ALL: "/api/wishlist",
  CLEAR_ALL: "/api/wishlist",
  DELETE_ITEM: (id: string) => `/api/wishlist/${id}`,
} as const;