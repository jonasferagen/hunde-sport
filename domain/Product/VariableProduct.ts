// domain/product/VariableProduct.ts
import { BaseProduct, BaseProductData } from "./BaseProduct";

type RawAttributeTerm = { id: number; name: string; slug: string };
export type RawAttribute = {
  id: number;
  name: string; // display name, e.g. "Størrelse"
  taxonomy: string; // e.g. "pa_storrelse"
  has_variations: boolean;
  terms: RawAttributeTerm[];
};

export type RawVariationRef = {
  id: number; // variation id
  attributes: {
    name: string; // attribute name as returned in refs, e.g. "Størrelse"
    value: string; // selected term slug, e.g. "xss"
  }[];
};

export interface VariableProductData extends BaseProductData {
  type: "variable";
  parent: 0;
  attributes: RawAttribute[];
  variations: RawVariationRef[];
}

export class VariableProduct extends BaseProduct {
  readonly rawAttributes: RawAttribute[];
  readonly rawVariations: RawVariationRef[];

  constructor(data: VariableProductData) {
    if (data.type !== "variable") {
      throw new Error("Invalid data type for VariableProduct");
    }
    super(data);
    this.rawAttributes = data.attributes ?? [];
    this.rawVariations = data.variations ?? [];
  }
}
