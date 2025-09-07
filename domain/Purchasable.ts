// @domain/purchasable/Purchasable.ts
import { CustomField } from "@/domain/CustomField";
import type {
  AttributeSelection,
  ProductVariation,
  Variation,
} from "@/domain/product";
import { Product } from "@/domain/product/Product";
import type { AddItemOptions } from "@/hooks/data/Cart/api";
import type { SimpleProduct, VariableProduct } from "@/types";
export type PurchasableProduct = SimpleProduct | VariableProduct;

export type PurchasableStatus =
  | "ready"
  | "select"
  | "select_incomplete"
  | "customize"
  | "customize_incomplete"
  | "sold_out"
  | "unavailable";

export type StatusDescriptor = { key: PurchasableStatus; label: string };

export const DEFAULT_STATUS_LABEL: Record<PurchasableStatus, string> = {
  ready: "Kjøp",
  select: "Se varianter",
  select_incomplete: "Velg ...",
  customize: "Tilpass",
  customize_incomplete: "Fyll inn påkrevde felt",
  sold_out: "Utsolgt",
  unavailable: "Ikke tilgjengelig",
} as const;

type Props = {
  product: Product;
  attributeSelection?: AttributeSelection;
  productVariation?: ProductVariation;
};

export class Purchasable {
  readonly product: Product;

  readonly attributeSelection?: AttributeSelection;
  readonly variation?: Variation;
  readonly productVariation?: ProductVariation;

  readonly customFields: CustomField[] = [];
  readonly customizationSatisfiedHint: boolean = false;

  private isInSelection: boolean = false;

  private constructor({
    product,
    attributeSelection,
    productVariation,
  }: Props) {
    this.product = product;
    if (this.product.type === "simple") {
      return;
    }

    this.productVariation = productVariation;
    this.attributeSelection = attributeSelection;

    if (this.attributeSelection) {
      this.isInSelection = true;
    }

    //this.customFields = customFields;

    // this.customizationSatisfiedHint = customizationSatisfiedHint;
  }
  static create(props: Props) {
    return new Purchasable(props);
  }

  get displayProduct(): SimpleProduct | VariableProduct | ProductVariation {
    return this.productVariation ? this.productVariation : this.product;
  }

  get variableProduct(): VariableProduct {
    if (!this.product.isVariable) {
      throw "Not a variable product";
    }
    return this.product as VariableProduct;
  }

  get hasCustomFields(): boolean {
    return this.product.hasCustomFields;
  }

  /** Any non-empty custom values entered? */
  get hasAnyCustomValues(): boolean {
    const arr = this.customFields ?? [];
    for (const f of arr) {
      const v = f?.value;
      if (typeof v === "string" && v.trim().length > 0) return true;
      if (typeof v === "number" && Number.isFinite(v)) return true;
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

  private get needsSelection(): boolean {
    return !this.isInSelection;
  }

  private resolveStatusKey(): PurchasableStatus {
    const { availability } = this.product;

    if (!availability.isInStock) return "sold_out";
    if (!availability.isPurchasable) return "unavailable";

    if (this.product.isVariable) {
      if (this.needsSelection) return "select";
      if (!this.variation) return "select_incomplete";
    }
    if (this.needsCustomization) return "customize";

    return "ready";
  }

  get status(): StatusDescriptor {
    const key = this.resolveStatusKey();
    let label = DEFAULT_STATUS_LABEL[key];
    if (key === "select_incomplete" && this.attributeSelection) {
      const selected = this.attributeSelection.selected;

      label =
        "Velg " +
        Object.keys(selected)
          .map((attrKey) => {
            const attribute = this.variableProduct.attributes.get(attrKey)!;
            return attribute.label;
          })
          .join(" og ")
          .toLowerCase();
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

    const ext = CustomField.toCartExtensions(this.customFields);

    if (this.product.isSimple) {
      return {
        id: this.product.id,
        quantity,
        ...(ext ? { extensions: ext.extensions } : {}),
      };
    }
    const options = this.variation!.options;
    const variation = { variation: options };

    return {
      id: this.product.id,
      quantity,
      ...variation,
      ...(ext ? { extensions: ext.extensions } : {}),
    };
  }
}
