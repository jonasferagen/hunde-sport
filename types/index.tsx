import { Product } from "@/models/Product";
import { ColorValue } from "react-native";

// Re-export models
export * from '@/models/Category';
export * from '@/models/Image';
export * from '@/models/Product';
export * from '@/models/ProductAttribute';
export * from '@/models/ProductAttributeOption';
export * from './tamagui';



// API-related types
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

// App-specific types
export interface Breadcrumb {
  id: number | null;
  name: string;
  type: 'category' | 'product' | 'home';
}

export interface ShoppingCartItem {
  baseProduct: Product;
  quantity: number;
  selectedVariant?: Product;
}

export interface IStyleVariant {
  readonly backgroundColor: string;
  readonly text: {
    readonly primary: string;
    readonly secondary: string;
  };
  readonly borderColor: string;
  getGradient(amounts?: number[]): [ColorValue, ColorValue];
}

// Defines the available theme variants for components
export type ThemeVariant = 'primary' | 'secondary' | 'accent';
