import { SimpleProduct, VariableProduct } from "@/types";

import { CustomField } from "./CustomField";
import { Product } from "./product/Product";
import { ProductVariation } from "./product/ProductVariation";
import { VariationSelection } from "./product/VariationSelection";

export type StatusDescriptor = { key: PurchasableStatus; label: string };
export type PurchasableProduct = SimpleProduct | VariableProduct;

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

export type PurchasableData = {
  product: PurchasableProduct;
  variationSelection?: VariationSelection;
  selectedVariation?: ProductVariation;
  customFields?: CustomField[];
  /** UI hint: inside customization UI, treat customization as satisfied */
  customizationSatisfiedHint?: boolean;
};

export class Purchasable {
  readonly product: Product;
  readonly variationSelection?: VariationSelection;
  readonly selectedVariation?: ProductVariation;
  readonly customFields?: CustomField[];
  readonly customizationSatisfiedHint: boolean;

  constructor(
    product: Product,
    variationSelection?: VariationSelection,
    selectedVariation?: ProductVariation,
    customFields?: CustomField[],
    customizationSatisfiedHint: boolean = false
  ) {
    this.product = product;
    this.variationSelection = variationSelection;
    this.selectedVariation = selectedVariation;
    this.customFields = customFields;
    this.customizationSatisfiedHint = customizationSatisfiedHint;
  }

  /** Optional convenience when building for the customization modal */
  withCustomizationSatisfied(): Purchasable {
    return new Purchasable(
      this.product,
      this.variationSelection,
      this.selectedVariation,
      this.customFields,
      true
    );
  }

  get hasCustomFields(): boolean {
    return this.product.hasCustomFields;
  }

  /** Any non-empty custom values entered? */
  get hasAnyCustomValues(): boolean {
    const arr = this.customFields ?? [];
    for (const f of arr) {
      if (typeof f?.value === "string" && f.value.trim().length > 0)
        return true;
    }
    return false;
  }

  /** Offer customization before add-to-cart? */
  get needsCustomization(): boolean {
    return (
      this.hasCustomFields &&
      !this.hasAnyCustomValues &&
      !this.customizationSatisfiedHint
    );
  }

  private resolveStatusKey(): PurchasableStatus {
    const { availability } = this.product;

    if (!availability.isInStock) return "sold_out";
    if (!availability.isPurchasable) return "unavailable";

    if (this.product.isVariable) {
      if (!this.variationSelection) return "select";
      if (!this.selectedVariation) return "select_incomplete";
    }

    if (this.needsCustomization) return "customize";

    return "ready";
  }

  get status(): StatusDescriptor {
    const key = this.resolveStatusKey();
    let label = DEFAULT_STATUS_LABEL[key];
    if (key === "select_incomplete" && this.variationSelection) {
      const msg = this.variationSelection.message?.();
      if (msg) label = msg;
    }
    return { key, label };
  }

  validate(): void {
    if (this.status.key === "ready") return;
    const { product, status } = this;
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

    const ext = CustomField.toCartExtensions(this.customFields);

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

// domain/purchasable/decidePurchasable.ts
import type { ThemeName } from "tamagui";

// pull themes from your existing config
import {
  THEME_CTA_BUY,
  THEME_CTA_OUTOFSTOCK,
  THEME_CTA_SELECTION_NEEDED,
  THEME_CTA_UNAVAILABLE,
  THEME_CTA_VIEW,
} from "@/config/app";
import { AddItemOptions } from "@/hooks/data/Cart/api";

export type DecisionNext =
  | "addToCart"
  | "openVariations"
  | "openCustomize"
  | "noop";

export type Decision = {
  next: DecisionNext;
  disabled: boolean;
  iconKey: string;
  theme: ThemeName;
  label: string;
};

type ConfigEntry = {
  iconKey: string;
  theme: ThemeName; // <- use ThemeName; your constants are strings and compatible
  next?: DecisionNext; // default "noop"
  disabled?: boolean; // default false
};

// Single source of truth, now driven by config/app constants
const CONFIG: Record<PurchasableStatus, ConfigEntry> = {
  ready: {
    iconKey: "ShoppingCart",
    theme: THEME_CTA_BUY,
    next: "addToCart",
  },
  select: {
    iconKey: "Boxes",
    theme: THEME_CTA_VIEW,
    next: "openVariations",
  },
  select_incomplete: {
    iconKey: "TriangleAlert",
    theme: THEME_CTA_SELECTION_NEEDED,
    disabled: true,
  },
  customize: {
    iconKey: "Brush",
    theme: THEME_CTA_VIEW,
    next: "openCustomize",
  },
  customize_incomplete: {
    iconKey: "TriangleAlert",
    theme: THEME_CTA_SELECTION_NEEDED,
    disabled: true,
  },
  sold_out: {
    iconKey: "CircleAlert",
    theme: THEME_CTA_OUTOFSTOCK,
    disabled: true,
  },
  unavailable: {
    iconKey: "XCircle",
    theme: THEME_CTA_UNAVAILABLE,
    disabled: true,
  },
};

export function decidePurchasable(purchasable: {
  status: StatusDescriptor;
}): Decision {
  const { key, label } = purchasable.status;
  const entry = CONFIG[key];
  return {
    next: entry.next ?? "noop",
    disabled: entry.disabled ?? false,
    iconKey: entry.iconKey,
    theme: entry.theme,
    label,
  };
}
