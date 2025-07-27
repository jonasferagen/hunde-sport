// Re-export models
export * from '@/models/Category';
export * from '@/models/Image';
export * from '@/models/Product';
export * from '@/models/ProductAttribute';
export * from '@/models/ProductAttributeOption';
export * from '@/models/ShoppingCart';
export * from './tamagui';

import { ProductVariation, SimpleProduct, VariableProduct } from '@/models/Product';

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

// Defines the available theme variants for components
export type ThemeVariant = 'primary' | 'secondary' | 'accent';

export type Purchasable =
  | {
    product: SimpleProduct;
    productVariation?: undefined; // Explicitly undefined for simple products
  }
  | {
    product: VariableProduct;
    productVariation: ProductVariation; // Required for variable products
  };


