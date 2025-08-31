// domain/Product/ProductFactory.ts
import type { ProductData } from "./Product";
import { Product } from "./Product";
import { ProductVariation } from "./ProductVariation";
import { SimpleProduct } from "./SimpleProduct";
import { VariableProduct } from "./VariableProduct";

export function productFromRaw(raw: ProductData): Product {
  switch (raw.type) {
    case "simple":
      return SimpleProduct.fromRaw(raw);
    case "variable":
      return VariableProduct.fromRaw(raw as any);
    case "variation":
      return ProductVariation.fromRaw(raw as any);
    default:
      throw new Error(`Unsupported product type: ${(raw as any).type}`);
  }
}
