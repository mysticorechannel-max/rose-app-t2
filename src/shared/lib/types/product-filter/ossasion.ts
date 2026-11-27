export type Occasion = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OccasionsResponse = {
  status: boolean;
  code: number;
  payload: {
    data: Occasion[];
    metadata: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};