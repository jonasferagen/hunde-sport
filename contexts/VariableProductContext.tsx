import React from "react";

import type {
  ProductAvailability,
  ProductPrices,
  ProductVariation,
  Term,
  VariableProduct,
} from "@/types";

export type VariableProductCtx = {
  variableProduct: VariableProduct;
  isLoading: boolean;

  // Lookups
  byId: (id: number) => ProductVariation | undefined;

  // Set-based access
  allVariationIdsSet: ReadonlySet<number>;
  variationSetForTerm: (attr: string, term: string) => ReadonlySet<number>;

  // Display helpers (accept arrays you create at the edge)
  pricesForIds: (ids: number[]) => ProductPrices[];
  availabilityForIds: (ids: number[]) => ProductAvailability[];

  // UI grouping
  termsByAttribute: Map<string, Term[]>;
};

const Ctx = React.createContext<VariableProductCtx | null>(null);
export const useVariableProduct = () => {
  const ctx = React.useContext(Ctx);
  if (!ctx)
    throw new Error(
      "useVariableProduct must be used within VariableProductProvider"
    );
  return ctx;
};

type Props = {
  variableProduct: VariableProduct;
  productVariations: ProductVariation[]; // hydrated; includes prices/availability
  isLoading?: boolean;
  children: React.ReactNode;
};

const EMPTY_SET: ReadonlySet<number> = Object.freeze(new Set<number>());

export function VariableProductProvider({
  variableProduct,
  productVariations,
  isLoading = false,
  children,
}: Props) {
  // id -> variation
  const variationById = React.useMemo(() => {
    const m = new Map<number, ProductVariation>();
    for (const v of productVariations) m.set(v.id, v);
    return m;
  }, [productVariations]);

  // attr -> term -> Set<variationId>
  const attrTermIndex = React.useMemo(() => {
    const outer = new Map<string, Map<string, Set<number>>>();
    for (const v of variableProduct.variations) {
      for (const { attribute, term } of v.options) {
        if (!outer.has(attribute)) outer.set(attribute, new Map());
        const inner = outer.get(attribute)!;
        if (!inner.has(term)) inner.set(term, new Set());
        inner.get(term)!.add(v.key);
      }
    }
    return outer;
  }, [variableProduct]);

  // Sets for all ids (immutable view)
  const allVariationIdsSet = React.useMemo<ReadonlySet<number>>(() => {
    const s = new Set<number>();
    for (const v of variableProduct.variations) s.add(v.key);
    return s;
  }, [variableProduct]);

  // Terms grouped by attribute (store order preserved)
  const termsByAttribute = React.useMemo(() => {
    const grouped = new Map<string, Term[]>();
    for (const attr of variableProduct.attributeOrder) grouped.set(attr, []);
    for (const [, term] of variableProduct.terms) {
      if (!grouped.has(term.attribute)) grouped.set(term.attribute, []);
      grouped.get(term.attribute)!.push(term);
    }
    return grouped;
  }, [variableProduct.attributeOrder, variableProduct.terms]);

  // Accessors
  const byId = React.useCallback(
    (id: number) => variationById.get(id),
    [variationById]
  );

  const variationSetForTerm = React.useCallback(
    (attr: string, term: string): ReadonlySet<number> =>
      attrTermIndex.get(attr)?.get(term) ?? EMPTY_SET,
    [attrTermIndex]
  );

  const pricesForIds = React.useCallback(
    (ids: number[]) =>
      ids
        .map((id) => variationById.get(id)?.prices)
        .filter(Boolean) as ProductPrices[],
    [variationById]
  );

  const availabilityForIds = React.useCallback(
    (ids: number[]) =>
      ids
        .map((id) => variationById.get(id)?.availability)
        .filter(Boolean) as ProductAvailability[],
    [variationById]
  );

  const value: VariableProductCtx = {
    variableProduct,
    isLoading,
    byId,
    allVariationIdsSet,
    variationSetForTerm,
    pricesForIds,
    availabilityForIds,
    termsByAttribute,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
