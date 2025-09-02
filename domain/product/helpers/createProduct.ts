// domain/product/helpers/createProduct.ts
import type { ProductData } from "../Product";
import { ProductVariation } from "../ProductVariation";
import { SimpleProduct } from "../SimpleProduct";
import { VariableProduct } from "../VariableProduct";

export function createProduct(data: ProductData) {
  switch (data.type) {
    case "simple":
      return SimpleProduct.create(data);
    case "variable":
      return VariableProduct.create(data);
    case "variation":
      return ProductVariation.create(data);
    default:
      throw new Error(
        `Unsupported product type: ${String((data as any)?.type)}`
      );
  }
}
