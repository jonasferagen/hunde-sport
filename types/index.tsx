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
  price: string,
  regular_price: string,
  sale_price: string,
  featured: boolean,
  stock_quantity: number,
  stock_status: string,
  description: string;
  short_description: string;
  categories: Category[];
  images: Image[];
  tags: Tag[];
  attributes: Attribute[];
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
