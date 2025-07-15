import { ViewStyle } from 'react-native';

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
  tags: Tag[];
  attributes: Attribute[];
  variations: number[];
  related_ids: number[];
}

export interface Attribute {
  id: number;
  name: string;
  slug: string;
  variation: boolean;
  options: string[];
  option?: string;
  position: number;
  visible: boolean;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Breadcrumb {
  id: number | null;
  name: string;
  type: 'category' | 'product' | 'home';
}

export interface Theme {
  readonly colors: {
    readonly primary: string;
    readonly secondary: string;
    readonly accent: string;
    readonly background: string;
    readonly card: string;
    readonly text: string;
    readonly textSecondary: string;
    readonly border: string;
    readonly error: string;
    readonly success: string;
    readonly info: string;
  };
  readonly gradients: {
    readonly primary: readonly [string, string, ...string[]];
    readonly secondary: readonly [string, string, ...string[]];
    readonly accent: readonly [string, string, ...string[]];
  };
  readonly tabs: {
    readonly active: string;
    readonly inactive: string;
  };
  readonly textOnColor: {
    readonly primary: string;
    readonly secondary: string;
    readonly accent: string;
  };
  readonly styles: {
    readonly disabled: ViewStyle;
  };
}
