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

export interface ProductCategory {
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
  categories: ProductCategory[];
  images: Image[];
}

export interface Breadcrumb {
  id: number | null;
  name: string;
  type?: 'productCategory' | 'product';
}
