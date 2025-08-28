// domain/purchase/purchasable.ts

import { ProductAvailability } from "@/domain/Product/BaseProduct";
import { ProductVariation } from "@/domain/Product/ProductVariation";
import { VariableProduct } from "@/domain/Product/VariableProduct";

import { ProductPrices } from "../pricing";
import { SimpleProduct } from "./SimpleProduct";

export type PurchasableProduct = VariableProduct | SimpleProduct;

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

          console.warn(labels);

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

export function buildVariationSelection(
  vp: VariableProduct,
  current: Map<AttributeKey, TermKey | null>
): VariationSelection {
  // Pre-index (attribute, term) → Set<variantId>
  const byAttrTerm = new Map<AttributeKey, Map<TermKey, Set<number>>>();
  for (const v of vp.variants) {
    for (const opt of v.options) {
      const inner =
        byAttrTerm.get(opt.attribute) ?? new Map<TermKey, Set<number>>();
      const set = inner.get(opt.term) ?? new Set<number>();
      set.add(v.key);
      inner.set(opt.term, set);
      byAttrTerm.set(opt.attribute, inner);
    }
  }

  const out: VariationSelection = new Map();

  for (const a of vp.attributes.values()) {
    // candidate set from other selected attributes
    let candidate: Set<number> | null = null;
    for (const [attr, term] of current) {
      if (!term || attr === a.key) continue;
      const subset = byAttrTerm.get(attr)?.get(term) ?? new Set<number>();
      candidate = candidate ? intersect(candidate, subset) : new Set(subset);
      if (candidate.size === 0) break;
    }

    const variantsByTerm = new Map<TermKey, number[]>();
    for (const t of vp.terms.values()) {
      if (t.attribute !== a.key) continue;
      const base = byAttrTerm.get(a.key)?.get(t.key) ?? new Set<number>();
      const final = candidate ? intersect(base, candidate) : base;
      variantsByTerm.set(t.key, [...final]);
    }

    out.set(a.key, {
      selected: current.get(a.key) ?? null,
      variantsByTerm,
    });
  }

  return out;
}

function intersect(a: Set<number>, b: Set<number>): Set<number> {
  const out = new Set<number>();
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const x of small) if (large.has(x)) out.add(x);
  return out;
}
