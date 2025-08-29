import React from "react";

import { useVariableProduct } from "@/contexts/VariableProductContext";
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
  selection: Map<string, string | null>;
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
  sel: Map<string, string | null>,
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
  const makeInitialSelection = React.useCallback(() => {
    const m = new Map<string, string | null>();
    for (const attr of variableProduct.attributeOrder) m.set(attr, null);
    return m;
  }, [variableProduct.attributeOrder]);

  const [selection, setSelection] = React.useState(makeInitialSelection);

  React.useEffect(() => {
    setSelection(makeInitialSelection());
  }, [makeInitialSelection]);

  const select = React.useCallback((attr: string, term: string | null) => {
    setSelection((prev) => {
      const next = new Map(prev);
      next.set(attr, term);
      return next;
    });
  }, []);

  const reset = React.useCallback(
    () => setSelection(makeInitialSelection()),
    [makeInitialSelection]
  );

  /** Candidates via intersection of all selected attrs (as Sets) */
  const candidateVariationSet = React.useMemo<ReadonlySet<number>>(() => {
    const filters: [string, string][] = [];
    for (const [a, t] of selection) if (t) filters.push([a, t]);
    if (filters.length === 0) return allVariationIdsSet;

    // smallest-first intersection
    const sets = filters
      .map(([a, t]) => variationSetForTerm(a, t))
      .sort((s1, s2) => s1.size - s2.size);

    let pool: ReadonlySet<number> | null = null;
    for (const s of sets) pool = pool ? intersectSets(pool, s) : s;
    return pool ?? EMPTY_SET;
  }, [selection, allVariationIdsSet, variationSetForTerm]);

  /** Resolve selectedVariation ONLY when selection is complete (signature-based) */
  const selectedVariation = React.useMemo(() => {
    const sig = selectionSignature(selection, variableProduct.attributeOrder);
    if (!sig) return undefined;
    const id = variationIdBySignature.get(sig);
    return id ? byId(id) : undefined;
  }, [selection, variableProduct.attributeOrder, variationIdBySignature, byId]);

  /** Build selectionView: for each attribute, exclude that attribute from filters */
  const selectionView = React.useMemo(() => {
    const view = new Map<string, SelectionViewForAttr>();

    for (const attr of variableProduct.attributeOrder) {
      const sel = selection.get(attr) ?? null;
      const terms = termsByAttribute.get(attr) ?? [];

      // base pool from other selected attrs
      const otherFilters: [string, string][] = [];
      for (const [a, t] of selection)
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
    selection,
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
        selection,
        selectedVariation
      ),
    [variableProduct, selection, selectedVariation]
  );

  const value: VariationSelectionCtx = {
    selection,
    selectionView,
    candidateVariationSet,
    selectedVariation,
    purchasable,
    select,
    reset,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
