// domain/Purchasable.ts
import type { AddItemOptions } from "@/stores/cartStore";
import type { ProductVariation, PurchasableProduct } from "@/types";

import { VariationSelection } from "./Product/VariationSelection";

export type PurchaseStatus =
  | "ready" // can buy now
  | "select" // variable product; open selector
  | "select_incomplete" // selection started but missing terms
  | "sold_out" // product out of stock
  | "unavailable"; // not purchasable

export type StatusDescriptor = {
  key: PurchaseStatus;
  label: string;
};

export const DEFAULT_STATUS_LABEL: Record<PurchaseStatus, string> = {
  ready: "Kjøp",
  select: "Se varianter",
  select_incomplete: "Velg ...",
  sold_out: "Utsolgt",
  unavailable: "Ikke tilgjengelig",
};

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

  /** Internal: compute status key from current state */
  private resolveStatusKey(): PurchaseStatus {
    const { availability } = this.product;

    if (!availability.isInStock) return "sold_out";
    if (!availability.isPurchasable) return "unavailable";

    if (this.product.isVariable) {
      if (!this.variationSelection) return "select";
      if (!this.selectedVariation) return "select_incomplete";
    }

    return "ready";
  }

  /**
   * Public status descriptor:
   *  - key drives icon/theme/press behavior
   *  - label is the default per key, with optional selection guidance
   */
  get status(): StatusDescriptor {
    const key = this.resolveStatusKey();
    let label = DEFAULT_STATUS_LABEL[key];

    // Allow VariationSelection to provide guidance text (if it implements message())
    if (key === "select_incomplete" && this.variationSelection) {
      const maybeMsg = this.variationSelection.message();
      if (maybeMsg) label = maybeMsg;
    }

    return { key, label };
  }

  /** Convert to Woo cart payload */
  toAddItemOptions(quantity = 1): AddItemOptions {
    if (this.product.isSimple) {
      return { id: this.product.id, quantity };
    }

    if (this.product.isVariable) {
      if (!this.selectedVariation) {
        // use the status label if it's selection-related, else a generic fallback
        const msg =
          this.status.key === "select_incomplete"
            ? this.status.label
            : "Velg variant";
        throw new Error(msg);
      }
      const variation = this.variationSelection
        ? Array.from(this.variationSelection)
            .filter(([, termKey]) => termKey != null)
            .map(([attribute, value]) => ({
              attribute,
              value: value as string,
            }))
        : [];
      return { id: this.product.id, quantity, variation };
    }

    throw new Error("Unsupported product type");
  }
}
