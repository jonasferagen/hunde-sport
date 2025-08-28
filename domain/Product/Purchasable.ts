// domain/purchase/purchasable.ts

import { ProductAvailability } from "@/domain/Product/BaseProduct";
import { ProductVariation } from "@/domain/Product/ProductVariation";
import { VariableProduct } from "@/domain/Product/VariableProduct";

import { ProductPrices } from "../pricing";

// Removed unused SimpleProduct import

type AttributeKey = string;
type TermKey = string;

export type VariationAttributeState = {
  selected: TermKey | null;
  variantsByTerm: Map<TermKey, number[]>;
};

export type VariationSelection = Map<AttributeKey, VariationAttributeState>;

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
  selection?: VariationSelection;
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
  if (variableProduct.type !== "variable") {
    throw new Error("createPurchasable expects a VariableProduct");
  }

  const activeProduct = productVariation ?? variableProduct;
  const prices = activeProduct.prices;
  const availability = activeProduct.availability;

  // ✅ FIX: check `.selected`, not truthiness of the state object
  let missingAttributes: string[] | undefined;
  if (selection) {
    const allKeys = [...variableProduct.attributes.keys()];
    missingAttributes = allKeys.filter(
      (k) => (selection.get(k)?.selected ?? null) == null
    );
  }

  const isValid = !!productVariation;
  const missing = missingAttributes ?? [];
  const labels = missing.map(
    (k) => variableProduct.attributes.get(k)?.label ?? k
  );
  const message = missing.length > 0 ? `Velg ${formatListNo(labels)}` : "";

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

// Norwegian-ish list joiner
function formatListNo(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} og ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} og ${items[items.length - 1]}`;
}

// --- selection builder that reuses a prebuilt index
export function buildVariationSelectionWithIndex(
  vp: VariableProduct,
  current: Map<string, string | null>,
  byAttrTerm: Map<string, Map<string, Set<number>>>
): VariationSelection {
  const out: VariationSelection = new Map();

  for (const a of vp.attributes.values()) {
    // candidate = intersection of other selected attrs
    let candidate: Set<number> | null = null;
    for (const [attr, term] of current) {
      if (!term || attr === a.key) continue;
      const subset = byAttrTerm.get(attr)?.get(term) ?? new Set<number>();
      candidate = candidate ? intersect(candidate, subset) : new Set(subset);
      if (candidate.size === 0) break;
    }

    const variantsByTerm = new Map<string, number[]>();
    for (const t of vp.terms.values()) {
      if (t.attribute !== a.key) continue;
      const base = byAttrTerm.get(a.key)?.get(t.key) ?? new Set<number>();
      const final = candidate ? intersect(base, candidate) : base;
      variantsByTerm.set(t.key, [...final]);
    }
    console.warn(variantsByTerm);
    out.set(a.key, { selected: current.get(a.key) ?? null, variantsByTerm });
  }

  return out;
}

// --- fast index: (attribute, term) -> Set<variantId>
function buildAttrTermIndex(
  vp: VariableProduct
): Map<string, Map<string, Set<number>>> {
  const byAttrTerm = new Map<string, Map<string, Set<number>>>();
  for (const v of vp.variants) {
    for (const opt of v.options) {
      const inner =
        byAttrTerm.get(opt.attribute) ?? new Map<string, Set<number>>();
      const set = inner.get(opt.term) ?? new Set<number>();
      set.add(v.key);
      inner.set(opt.term, set);
      byAttrTerm.set(opt.attribute, inner);
    }
  }
  return byAttrTerm;
}

// --- tiny factory you use from the component (recommended export)
export function createVariationSelectionBuilder(vp: VariableProduct) {
  const index = buildAttrTermIndex(vp);
  return (current: Map<string, string | null>) =>
    buildVariationSelectionWithIndex(vp, current, index);
}

// If you need this elsewhere, export it.
export function intersect(a: Set<number>, b: Set<number>): Set<number> {
  const out = new Set<number>();
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const x of small) if (large.has(x)) out.add(x);
  return out;
}
