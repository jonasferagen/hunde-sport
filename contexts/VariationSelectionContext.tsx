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
  selectionView: Map<string, SelectionViewForAttr>;
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

export function VariationSelectionProvider({ children }: Props) {
  const { variableProduct, byId, termsByAttribute } = useVariableProduct();

  const allVariationIdsSet = variableProduct.variationIdSet;

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

  /** Resolve selectedVariation ONLY when selection is complete (signature-based) */
  const selectedVariation = React.useMemo(() => {
    const sig = variationSelection.toSignature();
    if (!sig) return undefined;
    const id = variationIdBySignature.get(sig);
    return id ? byId(id) : undefined;
  }, [variationSelection, variationIdBySignature, byId]);

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
          .map(([a, t]) => variableProduct.getVariationSetForTerm(t))
          .sort((s1, s2) => s1.size - s2.size);
        let acc: ReadonlySet<number> | null = null;
        for (const s of sets) acc = acc ? intersectSets(acc, s) : s;
        basePool = acc ?? EMPTY_SET;
      }

      const vbt = new Map<string, ReadonlySet<number>>();
      for (const t of terms) {
        const sForTerm = variableProduct.getVariationSetForTerm(t.key);
        vbt.set(t.key, intersectSets(basePool, sForTerm));
      }

      view.set(attr, { selected: sel, variationSetByTerm: vbt });
    }

    return view;
  }, [
    variableProduct,
    variationSelection,
    termsByAttribute,
    allVariationIdsSet,
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
    selectionView,
    selectedVariation,
    purchasable,
    select,
    reset,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
