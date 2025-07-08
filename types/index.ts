export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

export type ApiError = {
  message: string;
  status: number;
};

export interface Image {
  src: string;
}

export interface Category {
  id: number;
  name: string;
  parent: number;
  image?: Image;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  short_description: string;
  categories: Category[];
  images: Image[];
}

export interface BaseContextType {
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}
