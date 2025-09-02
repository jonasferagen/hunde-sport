// contexts/VariationSelectionContext.tsx
import React from "react";

import { useVariableProduct } from "@/contexts/VariableProductContext";
import type { Term } from "@/domain/product/ProductAttributes";
import { VariationSelection } from "@/domain/product/VariationSelection";
import { Purchasable } from "@/domain/Purchasable";
import { intersectSets } from "@/lib/util"; // variadic
import type { ProductVariation } from "@/types";

export type SelectionViewForAttr = {
  selected: string | null;
  /** termSlug -> contextual set of variation ids (excluding this attribute from filters) */
  variationSetByTerm: Map<string, ReadonlySet<number>>;
};

export type VariationSelectionCtx = {
  /** For the selector UI */
  selectionView: Map<string, SelectionViewForAttr>;
  /** Canonical purchase surface */
  purchasable: Purchasable;
  /** Mutations used by the selector UI */
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

type Props = {
  children: React.ReactNode;
  initialSelection?: VariationSelection;
};

export function VariationSelectionProvider({
  children,
  initialSelection,
}: Props) {
  const { variableProduct, byId, termsByAttribute } = useVariableProduct();

  /** Build initial selection (optionally seeding from props) */
  const makeInitialSelection = React.useCallback(
    () =>
      initialSelection ??
      new VariationSelection(
        // new ctor takes VariableProduct
        variableProduct
      ),
    [initialSelection, variableProduct]
  );

  const [variationSelection, setVariationSelection] =
    React.useState<VariationSelection>(makeInitialSelection);

  // Reset selection when product changes (or initialSelection is swapped)
  React.useEffect(() => {
    setVariationSelection(makeInitialSelection());
  }, [makeInitialSelection]);

  const select = React.useCallback((attr: string, term: string | null) => {
    setVariationSelection((prev) => prev.with(attr, term));
  }, []);

  const reset = React.useCallback(() => {
    setVariationSelection(makeInitialSelection());
  }, [makeInitialSelection]);

  /** Resolve selected variation via VariableProduct.getVariationId */
  const selectedVariation: ProductVariation | undefined = React.useMemo(() => {
    if (!variationSelection.isComplete()) return undefined;

    const termSlugs = variableProduct.attributeOrder.map(
      (attr) => variationSelection.get(attr)!
    );
    const id = variableProduct.getVariationId(termSlugs);
    return id ? byId(id) : undefined;
  }, [variationSelection, variableProduct, byId]);

  /** Build selectionView: for each attribute, intersect base pool (other selections) with each term’s global set */
  const selectionView = React.useMemo(() => {
    const view = new Map<string, SelectionViewForAttr>();

    for (const attr of variableProduct.attributeOrder) {
      const selected = variationSelection.get(attr) ?? null;

      // gather filters from *other* attributes
      const otherSelectedTermSets: ReadonlySet<number>[] = [];
      for (const [a, t] of variationSelection) {
        if (a !== attr && t) {
          otherSelectedTermSets.push(variableProduct.getVariationSetForTerm(t));
        }
      }

      // base pool is either "all ids" or the intersection of other selected terms
      const basePool =
        otherSelectedTermSets.length === 0
          ? variableProduct.variationIdSet
          : intersectSets<number>(...otherSelectedTermSets);

      // contextual sets for each term in this attribute (keep store order)
      const vbt = new Map<string, ReadonlySet<number>>();
      const terms: Term[] = termsByAttribute.get(attr) ?? [];
      for (const t of terms) {
        const termSet = variableProduct.getVariationSetForTerm(t.key);
        vbt.set(t.key, intersectSets(basePool, termSet));
      }

      view.set(attr, { selected, variationSetByTerm: vbt });
    }

    return view;
  }, [variationSelection, variableProduct, termsByAttribute]);

  /** Canonical purchasable for consumers */
  const purchasable = React.useMemo(
    () =>
      new Purchasable(variableProduct, variationSelection, selectedVariation),
    [variableProduct, variationSelection, selectedVariation]
  );

  const value: VariationSelectionCtx = {
    selectionView,
    purchasable,
    select,
    reset,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
