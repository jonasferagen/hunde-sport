import React from "react";

import { useVariableProduct } from "@/contexts/VariableProductContext";
import { VariationSelection } from "@/domain/Product/VariationSelection";
import {
  createPurchasableFromSelection,
  Purchasable,
} from "@/domain/Purchasable";
import type { ProductVariation } from "@/types";

export type SelectionViewForAttr = {
  selected: string | null;
  // termSlug -> contextual set of variation ids (excluding this attribute from filters)
  variationSetByTerm: Map<string, ReadonlySet<number>>;
};

export type VariationSelectionCtx = {
  variationSelection: VariationSelection;
  selectionView: Map<string, SelectionViewForAttr>;
  candidateVariationSet: ReadonlySet<number>;
  selectedVariation?: ProductVariation;
  purchasable: Purchasable;
  select: (attr: string, term: string | null) => void;
  reset: () => void;
};

const Ctx = React.createContext<VariationSelectionCtx | null>(null);
export const useVariationSelection = () => {
  const ctx = React.useContext(Ctx);
  if (!ctx)
    throw new Error(
      "useVariationSelection must be used within VariationSelectionProvider"
    );
  return ctx;
};

type Props = { children: React.ReactNode };

const EMPTY_SET: ReadonlySet<number> = Object.freeze(new Set<number>());

// small util
const intersectSets = (
  a: ReadonlySet<number>,
  b: ReadonlySet<number>
): ReadonlySet<number> => {
  if (a.size === 0 || b.size === 0) return EMPTY_SET;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  const out = new Set<number>();
  for (const id of small) if (large.has(id)) out.add(id);
  return out;
};

/** Canonical signature for a complete selection */
function selectionSignature(
  sel: VariationSelection,
  order: string[]
): string | null {
  for (const a of order) {
    const t = sel.get(a);
    if (!t) return null;
  }
  return order.map((a) => `${a}=${sel.get(a)}`).join("|");
}

export function VariationSelectionProvider({ children }: Props) {
  const {
    variableProduct,
    allVariationIdsSet,
    variationSetForTerm,
    byId,
    termsByAttribute,
  } = useVariableProduct();

  /** Precompute selection signature → variation id */
  const variationIdBySignature = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const v of variableProduct.variations) {
      const sig = variableProduct.attributeOrder
        .map((attr) => {
          const opt = v.options.find((o) => o.attribute === attr);
          return `${attr}=${opt?.term ?? ""}`;
        })
        .join("|");
      map.set(sig, v.key);
    }
    return map;
  }, [variableProduct]);

  /** Initial empty selection */
  const makeInitialSelection = React.useCallback(
    () => new VariationSelection(variableProduct.attributeOrder),
    [variableProduct.attributeOrder]
  );

  const [variationSelection, setVariationSelection] =
    React.useState<VariationSelection>(makeInitialSelection);

  React.useEffect(() => {
    setVariationSelection(makeInitialSelection());
  }, [makeInitialSelection]);

  const select = React.useCallback((attr: string, term: string | null) => {
    setVariationSelection((prev) => prev.with(attr, term));
  }, []);

  const reset = React.useCallback(
    () => setVariationSelection(makeInitialSelection()),
    [makeInitialSelection]
  );

  /** Candidates via intersection of all selected attrs (as Sets) */
  const candidateVariationSet = React.useMemo<ReadonlySet<number>>(() => {
    const filters: [string, string][] = [];
    for (const [a, t] of variationSelection) if (t) filters.push([a, t]);
    if (filters.length === 0) return allVariationIdsSet;

    // smallest-first intersection
    const sets = filters
      .map(([a, t]) => variationSetForTerm(a, t))
      .sort((s1, s2) => s1.size - s2.size);

    let pool: ReadonlySet<number> | null = null;
    for (const s of sets) pool = pool ? intersectSets(pool, s) : s;
    return pool ?? EMPTY_SET;
  }, [variationSelection, allVariationIdsSet, variationSetForTerm]);

  /** Resolve selectedVariation ONLY when selection is complete (signature-based) */
  const selectedVariation = React.useMemo(() => {
    const sig = selectionSignature(
      variationSelection,
      variableProduct.attributeOrder
    );
    if (!sig) return undefined;
    const id = variationIdBySignature.get(sig);
    return id ? byId(id) : undefined;
  }, [
    variationSelection,
    variableProduct.attributeOrder,
    variationIdBySignature,
    byId,
  ]);

  /** Build selectionView: for each attribute, exclude that attribute from filters */
  const selectionView = React.useMemo(() => {
    const view = new Map<string, SelectionViewForAttr>();

    for (const attr of variableProduct.attributeOrder) {
      const sel = variationSelection.get(attr) ?? null;
      const terms = termsByAttribute.get(attr) ?? [];

      // base pool from other selected attrs
      const otherFilters: [string, string][] = [];
      for (const [a, t] of variationSelection)
        if (a !== attr && t) otherFilters.push([a, t]);

      let basePool: ReadonlySet<number>;
      if (otherFilters.length === 0) {
        basePool = allVariationIdsSet;
      } else {
        const sets = otherFilters
          .map(([a, t]) => variationSetForTerm(a, t))
          .sort((s1, s2) => s1.size - s2.size);
        let acc: ReadonlySet<number> | null = null;
        for (const s of sets) acc = acc ? intersectSets(acc, s) : s;
        basePool = acc ?? EMPTY_SET;
      }

      const vbt = new Map<string, ReadonlySet<number>>();
      for (const t of terms) {
        const sForTerm = variationSetForTerm(attr, t.key);
        vbt.set(t.key, intersectSets(basePool, sForTerm));
      }

      view.set(attr, { selected: sel, variationSetByTerm: vbt });
    }

    return view;
  }, [
    variationSelection,
    variableProduct.attributeOrder,
    termsByAttribute,
    allVariationIdsSet,
    variationSetForTerm,
  ]);

  /** Purchasable derived */
  const purchasable = React.useMemo(
    () =>
      createPurchasableFromSelection(
        variableProduct,
        variationSelection,
        selectedVariation
      ),
    [variableProduct, variationSelection, selectedVariation]
  );

  const value: VariationSelectionCtx = {
    variationSelection,
    selectionView,
    candidateVariationSet,
    selectedVariation,
    purchasable,
    select,
    reset,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
