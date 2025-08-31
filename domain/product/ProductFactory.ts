// domain/Product/ProductFactory.ts
import type { ProductData } from "./Product";
import { Product } from "./Product";
import { ProductVariation } from "./ProductVariation";
import { SimpleProduct } from "./SimpleProduct";
import { VariableProduct } from "./VariableProduct";

export function productFromRaw(data: ProductData): Product {
  switch (data.type) {
    case "simple":
      return SimpleProduct.create(data);
    case "variable":
      return VariableProduct.create(data as any);
    case "variation":
      return ProductVariation.create(data as any);
    default:
      throw new Error(`Unsupported product type: ${(data as any).type}`);
  }
}
