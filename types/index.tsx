import { Product } from "@/models/Product";
import { ProductVariation } from "@/models/ProductVariation";


// Re-export models
export * from '@/models/Category';
export * from '@/models/Image';
export * from '@/models/Product';
export * from '@/models/ProductAttribute';
export * from '@/models/ProductAttributeOption';
export * from '@/models/ProductVariation';
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

export class ShoppingCartItem {
  readonly key: string;

  constructor(
    public product: Product,
    public productVariation: ProductVariation | undefined,
    public quantity: number
  ) {
    this.key = `${this.product.id}-${this.productVariation?.id ?? 'simple'}`;
  }
}

export type ShoppingCart = ShoppingCartItem[];


// Defines the available theme variants for components
export type ThemeVariant = 'primary' | 'secondary' | 'accent';
