export type Category = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  subCategories: {
    id: string;
    title: string;
  }[];
  _count: {
    products: number;
  };
};

export type CategoriesResponse = {
  status: boolean;
  code: number;
  payload: {
    data: Category[];
    metadata: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};