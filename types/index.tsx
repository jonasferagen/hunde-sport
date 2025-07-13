export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
  headers: Headers;
};

export type ApiError = {
  message: string;
  status: number;
};

/**
 * Image interface
 */
export interface Image {
  src: string;
}

export interface Category {
  id: number;
  name: string;
  parent: number;
  image?: Image;
  count: number;
}

export interface Product {
  id: number;
  name: string;
  price: number,
  regular_price: number,
  sale_price: number,
  featured: boolean,
  stock_status: string,
  description: string;
  short_description: string;
  categories: Category[];
  images: Image[];
  tags: Tag[];
  attributes: Attribute[];
  variations: number[];
  related_ids: number[];
}

export interface Attribute {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Breadcrumb {
  id: number | null;
  name: string;
  type?: 'category' | 'product';
}
