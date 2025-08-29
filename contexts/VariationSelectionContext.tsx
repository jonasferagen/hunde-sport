import React from "react";

import { useVariableProduct } from "@/contexts/VariableProductContext";
import {
  createPurchasableFromSelection,
  Purchasable,
} from "@/domain/Purchasable";
import type { ProductVariation } from "@/types";

export type SelectionViewForAttr = {
  selected: string | null;
  variationsByTerm: Map<string, number[]>; // termSlug -> filtered variation ids
};

export type VariationSelectionCtx = {
  selection: Map<string, string | null>;
  selectionView: Map<string, SelectionViewForAttr>;
  candidateVariationIds: number[];
  selectedVariation?: ProductVariation;
  purchasable: Purchasable;
  select: (attr: string, term: string | null) => void;
  reset: () => void;
};

const Ctx = React.createContext<VariationSelectionCtx | null>(null);

export const useVariationSelection = () => {
  const ctx = React.useContext(Ctx);
  if (!ctx) {
    throw new Error(
      "useVariationSelection must be used within VariationSelectionProvider"
    );
  }
  return ctx;
};

type Props = { children: React.ReactNode };

/** Helper: build a canonical signature from a complete selection */
function makeSelectionSignature(
  selection: Map<string, string | null>,
  attributeOrder: string[]
): string | null {
  for (const attr of attributeOrder) {
    const term = selection.get(attr);
    if (!term) return null; // incomplete
  }
  return attributeOrder
    .map((attr) => `${attr}=${selection.get(attr)}`)
    .join("|");
}

export function VariationSelectionProvider({ children }: Props) {
  const {
    variableProduct,
    allVariationIds,
    byId,
    variationIdsForTerm,
    termsByAttribute,
  } = useVariableProduct();

  /** Precompute variationIdBySignature once per product */
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

  /** Build initial empty selection */
  const makeInitialSelection = React.useCallback(() => {
    const m = new Map<string, string | null>();
    for (const attr of variableProduct.attributeOrder) {
      m.set(attr, null);
    }
    return m;
  }, [variableProduct.attributeOrder]);

  /** Selection state */
  const [selection, setSelection] = React.useState(makeInitialSelection);

  /** Auto-reset when product changes */
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

  const reset = React.useCallback(() => {
    setSelection(makeInitialSelection());
  }, [makeInitialSelection]);

  /** Candidates via intersection (unchanged) */
  const candidateVariationIds = React.useMemo(() => {
    const filters: [string, string][] = [];
    for (const [attr, term] of selection) {
      if (term) filters.push([attr, term]);
    }

    if (filters.length === 0) return allVariationIds;

    const lists = filters
      .map(([a, t]) => variationIdsForTerm(a, t))
      .filter((l) => l.length > 0)
      .sort((a, b) => a.length - b.length);

    if (lists.length === 0) return [];

    let acc = new Set<number>(lists[0]);
    for (let i = 1; i < lists.length; i++) {
      const next = new Set<number>();
      for (const id of lists[i]) if (acc.has(id)) next.add(id);
      acc = next;
      if (acc.size === 0) break;
    }
    return Array.from(acc);
  }, [selection, allVariationIds, variationIdsForTerm]);

  /** Selected variation: only resolve if selection is complete */
  const selectedVariation = React.useMemo(() => {
    const sig = makeSelectionSignature(
      selection,
      variableProduct.attributeOrder
    );
    if (!sig) return undefined; // incomplete
    const id = variationIdBySignature.get(sig);
    return id ? byId(id) : undefined;
  }, [selection, variableProduct.attributeOrder, variationIdBySignature, byId]);

  /** Build selectionView */
  const selectionView = React.useMemo(() => {
    // tiny helper
    const intersectMany = (lists: number[][]): Set<number> => {
      if (lists.length === 0) return new Set<number>();
      // start with smallest list for speed
      lists.sort((a, b) => a.length - b.length);
      let acc = new Set<number>(lists[0]);
      for (let i = 1; i < lists.length; i++) {
        const next = new Set<number>();
        for (const id of lists[i]) if (acc.has(id)) next.add(id);
        acc = next;
        if (acc.size === 0) break;
      }
      return acc;
    };

    const view = new Map<string, SelectionViewForAttr>();

    for (const attr of variableProduct.attributeOrder) {
      const sel = selection.get(attr) ?? null;
      const terms = termsByAttribute.get(attr) ?? [];
      const vbt = new Map<string, number[]>();

      // 1) Build base pool from all *other* selected attributes
      const filtersExceptThis: [string, string][] = [];
      for (const [a, term] of selection) {
        if (a !== attr && term) filtersExceptThis.push([a, term]);
      }

      let basePoolSet: Set<number>;
      if (filtersExceptThis.length === 0) {
        basePoolSet = new Set<number>(allVariationIds);
      } else {
        const lists = filtersExceptThis
          .map(([a, t]) => variationIdsForTerm(a, t))
          .filter((l) => l.length > 0);
        basePoolSet = lists.length ? intersectMany(lists) : new Set<number>();
      }

      // 2) For each term in this attribute, intersect with base pool
      for (const t of terms) {
        const idsForTerm = variationIdsForTerm(attr, t.key);
        if (idsForTerm.length === 0) {
          // globally-unused term should already be pruned by your VariableProduct post-step,
          // but keep this guard anyway
          vbt.set(t.key, []);
          continue;
        }
        const inter = new Set<number>();
        for (const id of idsForTerm) if (basePoolSet.has(id)) inter.add(id);
        vbt.set(t.key, Array.from(inter));
      }

      view.set(attr, { selected: sel, variationsByTerm: vbt });
    }

    return view;
  }, [
    selection,
    variableProduct.attributeOrder,
    termsByAttribute,
    allVariationIds,
    variationIdsForTerm,
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
    candidateVariationIds,
    selectedVariation,
    purchasable,
    select,
    reset,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
