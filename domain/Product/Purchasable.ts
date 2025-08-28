// domain/purchase/purchasable.ts

import { ProductAvailability } from "@/domain/Product/BaseProduct";
import { ProductVariation } from "@/domain/Product/ProductVariation";
import { VariableProduct } from "@/domain/Product/VariableProduct";

import { ProductPrices } from "../pricing";
import { SimpleProduct } from "./SimpleProduct";

export type PurchasableProduct = VariableProduct | SimpleProduct;

export type VariationSelection = Map<string, string | null>;

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface Purchasable extends ValidationResult {
  variableProduct: VariableProduct;
  productVariation?: ProductVariation;
  activeProduct: VariableProduct | ProductVariation;
  prices: ProductPrices;
  availability: ProductAvailability;
  isVariable: true;

  /** Current selection (attrKey -> termKey|null) */
  selection?: VariationSelection;

  /** For missing selection: which attribute keys are still unset */
  missingAttributes?: string[];
}

export const createPurchasable = ({
  variableProduct,
  productVariation,
  selection,
}: {
  variableProduct: VariableProduct;
  productVariation?: ProductVariation;
  selection?: VariationSelection;
}): Purchasable => {
  // guard: only VariableProduct supported here
  if (variableProduct.type !== "variable") {
    throw new Error("createPurchasable expects a VariableProduct");
  }

  const activeProduct = productVariation ?? variableProduct;
  const prices = activeProduct.prices;
  const availability = activeProduct.availability;

  // derive missing attribute keys from selection (if provided)
  let missingAttributes: string[] | undefined;
  if (selection) {
    const allKeys = [...variableProduct.attributes.keys()];
    missingAttributes = allKeys.filter((k) => !selection.get(k));
  }

  // build message
  const isValid = !!productVariation;
  const message = isValid
    ? "Legg til"
    : (() => {
        if (!selection) return "Velg ...(A)";
        const missing = missingAttributes ?? [];
        if (missing.length > 0) {
          const labels = missing.map(
            (k) => variableProduct.attributes.get(k)?.label ?? k
          );
          return `Velg ${formatListNo(labels)}`;
        }
        return "Velg ...(B)";
      })();

  return {
    variableProduct,
    productVariation,
    activeProduct,
    prices,
    availability,
    isVariable: true,
    selection,
    missingAttributes,
    isValid,
    message,
  };
};

// Norwegian-ish list joiner: "farge", "størrelse" → "farge og størrelse"
function formatListNo(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} og ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} og ${items[items.length - 1]}`;
}
