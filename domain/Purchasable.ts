import { ProductVariation } from "@/domain/Product/ProductVariation";
import type { AddItemOptions } from "@/stores/cartStore";
import { PurchasableProduct } from "@/types";

import { VariationSelection } from "./Product/VariationSelection";

export class Purchasable {
  readonly product: PurchasableProduct;
  readonly variationSelection?: VariationSelection;
  readonly selectedVariation?: ProductVariation;

  constructor(
    product: PurchasableProduct,
    variationSelection?: VariationSelection,
    selectedVariation?: ProductVariation
  ) {
    this.product = product;
    this.variationSelection = variationSelection;
    this.selectedVariation = selectedVariation;
  }

  /** Which attributes are still missing a term (only relevant for variable products) */
  get missing(): string[] {
    if (!this.variationSelection) return [];
    return this.variationSelection.missing();
  }

  /** UX message for current selection (variable products only). Empty string otherwise. */
  get message(): string {
    if (!this.variationSelection) return "";
    return this.variationSelection.message();
  }

  /** True if a concrete variation is chosen */
  get isResolved(): boolean {
    return !!this.selectedVariation;
  }

  /** Convert this purchasable into AddItemOptions for cartStore */
  toAddItemOptions(quantity = 1): AddItemOptions {
    if (this.product.isSimple) {
      return { id: this.product.id, quantity };
    }

    if (this.product.isVariable) {
      if (!this.selectedVariation) {
        throw new Error(this.message || "Velg variant");
      }
      const variation = this.variationSelection
        ? Array.from(this.variationSelection)
            .filter(([, termKey]) => termKey != null)
            .map(([attrKey, termKey]) => ({
              attribute: attrKey,
              value: termKey as string,
            }))
        : [];

      return { id: this.product.id, quantity, variation };
    }

    throw new Error("Unsupported product type");
  }
}
