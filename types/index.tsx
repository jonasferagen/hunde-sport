// Re-export models
export * from '@/models/Category';
export * from '@/models/Image';
export * from '@/models/Product/Product';
export * from '@/models/Product/ProductAttribute';
export * from '@/models/Product/ProductAttributeOption';
export * from '@/models/Product/ProductVariation';
export * from './tamagui';

import { ProductVariation } from '@/models/Product/ProductVariation';
import { SimpleProduct } from '@/models/Product/SimpleProduct';
import { VariableProduct } from '@/models/Product/VariableProduct';

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



export type Purchasable =
  | {
    product: SimpleProduct;
    productVariation?: undefined; // Explicitly undefined for simple products
  }
  | {
    product: VariableProduct;
    productVariation: ProductVariation; // Required for variable products
  };


