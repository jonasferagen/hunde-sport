import React from "react";

import type {
  ProductAvailability,
  ProductPrices,
  ProductVariation,
  Term,
  VariableProduct,
} from "@/types"; // your consolidated types module

export type VariableProductCtx = {
  variableProduct: VariableProduct;
  isLoading: boolean;
  byId: (id: number) => ProductVariation | undefined;
  allVariationIds: number[];
  pricesForIds: (ids: number[]) => ProductPrices[];
  availabilityForIds: (ids: number[]) => ProductAvailability[];
  variationIdsForTerm: (attr: string, term: string) => number[];
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
  /** The fully-hydrated variations from your API: includes prices, availability, etc. */
  productVariations: ProductVariation[];
  isLoading?: boolean;
  children: React.ReactNode;
};

export function VariableProductProvider({
  variableProduct,
  productVariations,
  isLoading = false,
  children,
}: Props) {
  // Map variationId -> ProductVariation (hydrated)
  const variationById = React.useMemo(() => {
    const m = new Map<number, ProductVariation>();
    for (const v of productVariations) m.set(v.id, v);
    return m;
  }, [productVariations]);

  // All variation ids (prefer the normalized model order if present, else from the fetched list)
  const allVariationIds = React.useMemo(() => {
    if (variableProduct.variations?.length) {
      return variableProduct.variations.map((v) => v.key);
    }
    return productVariations.map((v) => v.id);
  }, [variableProduct.variations, productVariations]);

  // termsByAttribute: group the flat terms map by term.attribute, preserving store order via attributeOrder
  const termsByAttribute = React.useMemo(() => {
    const grouped = new Map<string, Term[]>();
    // initialize keys in store order so iteration is stable
    for (const attr of variableProduct.attributeOrder) grouped.set(attr, []);
    for (const [, term] of variableProduct.terms) {
      if (!grouped.has(term.attribute)) grouped.set(term.attribute, []);
      grouped.get(term.attribute)!.push(term);
    }
    return grouped;
  }, [variableProduct.attributeOrder, variableProduct.terms]);

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
  }, [variableProduct.variations]);

  const byId = React.useCallback(
    (id: number) => variationById.get(id),
    [variationById]
  );

  const pricesForIds = React.useCallback(
    (ids: number[]): ProductPrices[] =>
      ids
        .map((id) => variationById.get(id)?.prices)
        .filter(Boolean) as ProductPrices[],
    [variationById]
  );

  const availabilityForIds = React.useCallback(
    (ids: number[]): ProductAvailability[] =>
      ids
        .map((id) => variationById.get(id)?.availability)
        .filter(Boolean) as ProductAvailability[],
    [variationById]
  );

  const variationIdsForTerm = React.useCallback(
    (attr: string, term: string): number[] => {
      const inner = attrTermIndex.get(attr);
      if (!inner) return [];
      const set = inner.get(term);
      return set ? Array.from(set) : [];
    },
    [attrTermIndex]
  );

  const buildSelection = React.useCallback(() => {
    const m = new Map<string, string | null>();
    for (const attr of variableProduct.attributeOrder) m.set(attr, null);
    return m;
  }, [variableProduct.attributeOrder]);

  const value = React.useMemo<VariableProductCtx>(
    () => ({
      variableProduct,
      isLoading,
      byId,
      allVariationIds,
      pricesForIds,
      availabilityForIds,
      variationIdsForTerm,
      termsByAttribute,
    }),
    [
      variableProduct,
      isLoading,
      byId,
      allVariationIds,
      pricesForIds,
      availabilityForIds,
      variationIdsForTerm,
      termsByAttribute,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
