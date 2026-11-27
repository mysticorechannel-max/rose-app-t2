export type ProductFilters = {
    categoryId: string | null;
    occasionId: string | null;
    rating: number | null;
    minPrice: number;
    maxPrice: number;
};