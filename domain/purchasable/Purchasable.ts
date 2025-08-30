// domain/purchasable/Purchasable.ts

import { AddItemOptions } from "@/stores/cartStore";

import { Product } from "../product/Product";
import { ProductVariation } from "../product/ProductVariation";
import { VariationSelection } from "../product/VariationSelection";

export type PurchaseStatus =
  | "ready"
  | "select"
  | "select_incomplete"
  | "sold_out"
  | "unavailable";

export type StatusDescriptor = { key: PurchaseStatus; label: string };

export const DEFAULT_STATUS_LABEL: Record<PurchaseStatus, string> = {
  ready: "Kjøp",
  select: "Se varianter",
  select_incomplete: "Velg ...",
  sold_out: "Utsolgt",
  unavailable: "Ikke tilgjengelig",
};

export class Purchasable {
  readonly product: Product;
  readonly variationSelection?: VariationSelection;
  readonly selectedVariation?: ProductVariation;

  constructor(
    product: Product,
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

  /** Public status descriptor (key + display label) */
  get status(): StatusDescriptor {
    const key = this.resolveStatusKey();
    let label = DEFAULT_STATUS_LABEL[key];
    if (key === "select_incomplete" && this.variationSelection) {
      const msg = this.variationSelection.message();
      if (msg) label = msg;
    }
    return { key, label };
  }

  validate(): void {
    const { product, status } = this;

    if (product.isSimple || product.isVariable) {
      if (status.key === "ready") return; // OK
    }
    throw new Error(
      `Invalid state for add-to-cart: ${status.key} (id=${product.id}, name=${product.name}, type=${product.type})`
    );
  }
  /** Testable helper: build Woo AddItemOptions from a Purchasable */
  /** Build Woo cart payload (data-only; easy to unit test) */
  toCartItem(quantity = 1): AddItemOptions {
    this.validate(); // ensure 'ready'

    if (this.product.isSimple) {
      return { id: this.product.id, quantity };
    }

    // variable: selection must be resolved if validate passed
    const variation = this.variationSelection
      ? [...this.variationSelection]
          .filter(([, term]) => term != null)
          .map(([attribute, value]) => ({ attribute, value: value as string }))
      : [];

    return { id: this.product.id, quantity, variation };
  }
}
