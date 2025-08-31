// Purchasable.ts
import { CustomField } from "@/domain/extensions/CustomField";
import { AddItemOptions } from "@/stores/cartStore";

import { Product } from "../product/Product";
import { ProductVariation } from "../product/ProductVariation";
import { VariationSelection } from "../product/VariationSelection";

export type StatusDescriptor = { key: PurchasableStatus; label: string };

export type PurchasableStatus =
  | "ready"
  | "select"
  | "select_incomplete"
  | "customize"
  | "customize_incomplete"
  | "sold_out"
  | "unavailable";

export const DEFAULT_STATUS_LABEL: Record<PurchasableStatus, string> = {
  ready: "Kjøp",
  select: "Se varianter",
  select_incomplete: "Velg ...",
  customize: "Tilpass",
  customize_incomplete: "Fyll inn påkrevde felt",
  sold_out: "Utsolgt",
  unavailable: "Ikke tilgjengelig",
};

type CustomValues = Record<string, string>;

export class Purchasable {
  readonly product: Product;
  readonly variationSelection?: VariationSelection;
  readonly selectedVariation?: ProductVariation;

  /** Current values keyed by CustomField.key */
  readonly customValues: CustomValues;

  constructor(
    product: Product,
    variationSelection?: VariationSelection,
    selectedVariation?: ProductVariation,
    customValues: CustomValues = {}
  ) {
    this.product = product;
    this.variationSelection = variationSelection;
    this.selectedVariation = selectedVariation;
    this.customValues = customValues;
  }

  /** Immutable updater for UI convenience */
  withCustomValue(key: string, value: string): Purchasable {
    return new Purchasable(
      this.product,
      this.variationSelection,
      this.selectedVariation,
      { ...this.customValues, [key]: value }
    );
  }

  get hasCustomFields(): boolean {
    return this.product.hasCustomFields;
  }

  /** Has the user entered any custom values yet? (non-empty strings) */
  get hasAnyCustomValues(): boolean {
    for (const v of Object.values(this.customValues ?? {})) {
      if (typeof v === "string" && v.trim().length > 0) return true;
    }
    return false;
  }

  /** Should the UI *offer* a customization step before add-to-cart? */
  get needsCustomization(): boolean {
    // You can tighten this later (e.g., gate if any required fields exist)
    return this.hasCustomFields && !this.hasAnyCustomValues;
  }

  /** Internal: compute status key from current state */
  private resolveStatusKey(): PurchasableStatus {
    const { availability } = this.product;

    if (!availability.isInStock) return "sold_out";
    if (!availability.isPurchasable) return "unavailable";

    // 1) Variations first (must be resolvable)
    if (this.product.isVariable) {
      if (!this.variationSelection) return "select";
      if (!this.selectedVariation) return "select_incomplete";
    }

    // 2) Then custom fields (if any)
    if (this.needsCustomization) {
      return "customize";
    }

    return "ready";
  }

  /** Public status descriptor (key + display label) */
  get status(): StatusDescriptor {
    const key = this.resolveStatusKey();
    let label = DEFAULT_STATUS_LABEL[key];

    // Preserve your “select_incomplete” message override
    if (key === "select_incomplete" && this.variationSelection) {
      const msg = this.variationSelection.message();
      if (msg) label = msg;
    }

    return { key, label };
  }

  validate(): void {
    const { product, status } = this;

    // Only allow READY through
    if (status.key === "ready") return;

    throw new Error(
      `Invalid state for add-to-cart: ${status.key} (id=${product.id}, name=${product.name}, type=${product.type})`
    );
  }

  toCartItem(quantity = 1): AddItemOptions {
    this.validate();

    const variation = this.variationSelection
      ? [...this.variationSelection]
          .filter(([, term]) => term != null)
          .map(([attribute, value]) => ({ attribute, value: value as string }))
      : [];

    const ext = CustomField.toCartExtensions(this.customValues); // may be undefined

    if (this.product.isSimple) {
      return {
        id: this.product.id,
        quantity,
        ...(ext ? { extensions: ext.extensions } : {}),
      };
    }

    return {
      id: this.product.id,
      quantity,
      variation,
      ...(ext ? { extensions: ext.extensions } : {}),
    };
  }
}
