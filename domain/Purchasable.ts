// @domain/purchasable/Purchasable.ts
import { CustomField } from "@/domain/CustomField";
import type {
  AttributeSelection as AttributeSelectionType,
  Term,
  Variation,
} from "@/domain/product";
import { Product } from "@/domain/product/Product";
import type { AddItemOptions } from "@/hooks/data/Cart/api";
import { intersectSets } from "@/lib/util";
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
  //variableProductVariant?: VariableProductVariant;
  attributeSelection?: AttributeSelectionType;
};

export class Purchasable {
  readonly product: Product;
  //variableProductVariant?: VariableProductVariant;
  //readonly attributeSelection?: AttributeSelectionType;
  readonly selectedTerms: readonly (Term | undefined)[] = [];
  readonly productVariation?: Variation;

  readonly customFields: CustomField[] = [];
  readonly customizationSatisfiedHint: boolean = false;

  private isInSelection: boolean = false;

  private constructor({ product, attributeSelection }: Props) {
    this.product = product;
    if (this.product.type === "simple") {
      return;
    }
    if (!attributeSelection) {
      return;
    }

    const variableProduct = this.variableProduct;
    const selectedTerms = attributeSelection.getTerms();

    this.isInSelection = true;
    this.selectedTerms = selectedTerms;

    if (!attributeSelection?.isComplete()) {
      return;
    }

    const sets = [];
    for (const term of selectedTerms) {
      const v = variableProduct.getVariationsByTerm(term!.key);
      sets.push(v);
    }
    const I = intersectSets(...sets);

    if (I.size === 1) {
      const v = Array.from(I)[0];
      this.productVariation = v;
    }
    //this.customFields = customFields;

    // this.customizationSatisfiedHint = customizationSatisfiedHint;
  }
  static create(props: Props) {
    return new Purchasable(props);
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
      if (!this.productVariation) return "select_incomplete";
    }

    if (this.needsCustomization) return "customize";

    return "ready";
  }

  get status(): StatusDescriptor {
    const key = this.resolveStatusKey();
    let label = DEFAULT_STATUS_LABEL[key];
    if (key === "select_incomplete" && this.selectedTerms) {
      const msg = this.selectedTerms.map((t) => t?.label).join(":");
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

    const ext = CustomField.toCartExtensions(this.customFields);

    if (this.product.isSimple) {
      return {
        id: this.product.id,
        quantity,
        ...(ext ? { extensions: ext.extensions } : {}),
      };
    }
    const options = this.productVariation!.options;
    const variation = { variation: options };

    return {
      id: this.product.id,
      quantity,
      ...variation,
      ...(ext ? { extensions: ext.extensions } : {}),
    };
  }
}
