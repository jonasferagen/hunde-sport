import React from "react";

import { useVariableProduct } from "@/contexts/VariableProductContext";
import {
  createPurchasableFromSelection,
  MinimalSelection,
  Purchasable,
} from "@/domain/Purchasable"; // your factory
import type { ProductVariation } from "@/types";

export type SelectionViewForAttr = {
  selected: string | null;
  variationIdsByTerm: Map<string, number[]>; // termSlug -> filtered variation ids
};

export type VariationSelectionCtx = {
  selection: MinimalSelection;
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
  if (!ctx)
    throw new Error(
      "useVariationSelection must be used within VariationSelectionProvider"
    );
  return ctx;
};

type Props = { children: React.ReactNode };

export function VariationSelectionProvider({ children }: Props) {
  const {
    variableProduct,
    allVariationIds,
    byId,
    variationIdsForTerm: variationIdsForTerm,
    termsByAttribute,
    buildSelection,
  } = useVariableProduct();

  // attr -> { selected: term|null }
  const [selection, setSelection] = React.useState(() => buildSelection());

  const select = React.useCallback((attr: string, term: string | null) => {
    setSelection((prev) => {
      const next = new Map(prev);
      next.set(attr, term);
      return next;
    });
  }, []);

  const reset = React.useCallback(
    () => setSelection(buildSelection()),
    [buildSelection]
  );

  const candidateVariationIds = React.useMemo(() => {
    const active: [string, string][] = [];
    for (const [attr, term] of selection) if (term) active.push([attr, term]);

    if (active.length === 0) return allVariationIds;

    const lists = active
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

  const selectedVariation = React.useMemo(
    () =>
      candidateVariationIds.length === 1
        ? byId(candidateVariationIds[0])
        : undefined,
    [candidateVariationIds, byId]
  );

  const selectionView = React.useMemo(() => {
    const view = new Map<string, SelectionViewForAttr>();
    const basePool = candidateVariationIds.length
      ? new Set(candidateVariationIds)
      : new Set(allVariationIds);

    for (const attr of variableProduct.attributeOrder) {
      const sel = selection.get(attr) ?? null;
      const terms = termsByAttribute.get(attr) ?? [];
      const vbt = new Map<string, number[]>();

      for (const t of terms) {
        const ids = new Set<number>(variationIdsForTerm(attr, t.key));
        const out = new Set<number>();
        for (const id of basePool) if (ids.has(id)) out.add(id);
        vbt.set(t.key, Array.from(out));
      }
      view.set(attr, { selected: sel, variationIdsByTerm: vbt });
    }
    return view;
  }, [
    selection,
    candidateVariationIds,
    allVariationIds,
    variableProduct.attributeOrder,
    termsByAttribute,
    variationIdsForTerm,
  ]);

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
