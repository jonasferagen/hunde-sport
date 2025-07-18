import { ColorValue } from "react-native";

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

export interface Image {
  src: string;
}

export interface Category {
  id: number;
  name: string;
  parent: number;
  image: Image;
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
  attributes: ProductAttribute[];
  variations: number[];
  related_ids: number[];
}

export interface ProductAttribute {
  id: number;
  name: string;
  slug: string;
  variation: boolean;
  options: string[];
  option?: string;
  position: number;
  visible: boolean;
}

export interface Breadcrumb {
  id: number | null;
  name: string;
  type: 'category' | 'product' | 'home';
}

export interface ShoppingCartItem {
  product: Product;
  quantity: number;
}

export interface IStyleVariant {
  readonly backgroundColor: string;
  readonly text: {
    readonly primary: string;
    readonly secondary: string;
  };
  readonly borderColor: string;
  getGradient(): [ColorValue, ColorValue];
}
