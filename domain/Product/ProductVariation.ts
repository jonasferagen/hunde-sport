// domain/product/ProductVariation.ts
import { BaseProduct, BaseProductData } from "./BaseProduct";

export interface ProductVariationData extends BaseProductData {
  type: "variation";
  parent: number; // parent VariableProduct id
  variation?: string; // Store API’s variation summary string
}

export class ProductVariation extends BaseProduct {
  parent: number;
  variation?: string;

  constructor(data: ProductVariationData) {
    if (data.type !== "variation") {
      throw new Error("Invalid data type for ProductVariation");
    }
    super(data);
    this.parent = data.parent;
    this.variation = data.variation;
  }
}
