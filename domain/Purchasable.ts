// domain/purchase/purchasable.ts
import { ProductVariation, VariableProduct } from "@/types";

export type MinimalSelection = Map<string, string | null>;

export type Purchasable = {
  variableProduct: VariableProduct;
  selection: MinimalSelection;
  isValid: boolean;
  selectedVariation?: ProductVariation; // unified name
  message: string;
  missing: string[]; // unified name
  status: "selection_needed" | "valid";
};

export function createPurchasableFromSelection(
  variableProduct: VariableProduct,
  selection: MinimalSelection,
  variation?: ProductVariation
): Purchasable {
  const isValid = !!variation;

  const missing = [...variableProduct.attributes.keys()].filter(
    (k) => (selection.get(k) ?? null) == null
  );

  const message =
    missing.length > 0
      ? `Velg ${formatListNo(
          missing.map((k) => variableProduct.attributes.get(k)?.label ?? k)
        )}`
      : "";

  return {
    variableProduct,
    selection,
    isValid,
    selectedVariation: variation, // unified name
    message,
    missing, // unified name
    status: isValid ? "valid" : "selection_needed",
  };
}

function formatListNo(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} og ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} og ${items[items.length - 1]}`;
}
