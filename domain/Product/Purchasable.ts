// domain/purchase/purchasable.ts
import { ProductAvailability } from "@/domain/Product/BaseProduct";
import { ProductVariation } from "@/domain/Product/ProductVariation";
import { SimpleProduct } from "@/domain/Product/SimpleProduct";
import { VariableProduct } from "@/domain/Product/VariableProduct";

import { ProductPrices } from "../pricing";

export type VariationSelection = Map<string, string | null>;

export type PurchasableProduct = SimpleProduct | VariableProduct;

export type ValidationStatus =
  | "OK"
  | "VARIATION_REQUIRED"
  | "OUT_OF_STOCK"
  | "INVALID_PRODUCT";

export interface ValidationResult {
  isValid: boolean;
  status: ValidationStatus;
  message: string;
}

const validate = ({
  product,
  productVariation,
}: {
  product: PurchasableProduct;
  productVariation?: ProductVariation;
}): ValidationResult => {
  if (!product) {
    return {
      isValid: false,
      status: "INVALID_PRODUCT",
      message: "Produkt utilgjengelig",
    };
  }

  if (product instanceof SimpleProduct && productVariation) {
    throw new Error("SimpleProduct cannot have a product variation");
  }

  const productToCheck = productVariation || product;

  if (!productToCheck.is_in_stock) {
    return {
      isValid: false,
      status: "OUT_OF_STOCK",
      message: "Utsolgt",
    };
  }

  if (product instanceof VariableProduct && !productVariation) {
    return {
      isValid: false,
      status: "VARIATION_REQUIRED",
      message: "Se varianter",
    };
  }

  return {
    isValid: true,
    status: "OK",
    message: "Legg til",
  };
};

export interface Purchasable extends ValidationResult {
  product: SimpleProduct | VariableProduct;
  productVariation?: ProductVariation;
  activeProduct: PurchasableProduct;
  prices: ProductPrices;
  availability: ProductAvailability;
  isVariable: boolean;

  /** Optional: current selection (only meaningful for VariableProduct) */
  selection?: VariationSelection;

  /** For VariableProduct + missing selection: which attribute keys are still unset */
  missingAttributes?: string[];
}

export const createPurchasable = ({
  product,
  productVariation,
  selection,
}: {
  product: PurchasableProduct;
  productVariation?: ProductVariation;
  selection?: VariationSelection;
}): Purchasable => {
  const validationResult = validate({ product, productVariation });
  const activeProduct = productVariation || product;

  const prices = activeProduct.prices;
  const availability = activeProduct.availability;

  // Derive missing attribute keys if we have a selection & variable product
  let missingAttributes: string[] | undefined = undefined;
  if (selection && product instanceof VariableProduct && !productVariation) {
    const keys = [...product.attributes.keys()];
    missingAttributes = keys.filter((k) => !selection.get(k));
  }

  return {
    product,
    productVariation,
    activeProduct,
    prices,
    availability,
    isVariable: product.type === "variable",
    selection,
    missingAttributes,
    ...validationResult,
  };
};
