// domain/purchase/purchasable.ts
import { VariableProduct } from "@/domain/Product/VariableProduct";

import { ProductVariation } from "./Product/ProductVariation";
import { VariationSelection } from "./Product/VariationSelection";

export type Purchasable = {
  variableProduct: VariableProduct;
  variationSelection: VariationSelection;
  selectedVariation?: ProductVariation;
  message: string;
  missing: string[];
};

export function createPurchasableFromSelection(
  variableProduct: VariableProduct,
  variationSelection: VariationSelection,
  variation?: ProductVariation
): Purchasable {
  const missing = variationSelection.missing();
  const message = variationSelection.message(variableProduct);
  return {
    variableProduct,
    variationSelection: variationSelection,
    selectedVariation: variation,
    message,
    missing,
  };
}
