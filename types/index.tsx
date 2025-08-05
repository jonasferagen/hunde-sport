// Re-export models
export * from '@/models/Image';
export * from '@/models/Product/BaseProduct';
export * from '@/models/Product/ProductAttribute';
export * from '@/models/Product/ProductVariation';
export * from '@/models/Product/SimpleProduct';
export * from '@/models/Product/VariableProduct';
export * from '@/models/ProductCategory';
export * from './tamagui';

import { ProductVariation } from '@/models/Product/ProductVariation';
import { SimpleProduct } from '@/models/Product/SimpleProduct';
import { VariableProduct } from '@/models/Product/VariableProduct';


export type Product = SimpleProduct | VariableProduct | ProductVariation;

export type Purchasable =
  | {
    product: SimpleProduct;
    productVariation?: undefined; // Explicitly undefined for simple products
  }
  | {
    product: VariableProduct;
    productVariation: ProductVariation; // Required for variable products
  };
