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

  // Terms grouped by attribute (store order preserved)
  const termsByAttribute = React.useMemo(() => {
    const grouped = new Map<string, Term[]>();
    for (const attrKey of variableProduct.attributeOrder) {
      const slugs = variableProduct.getTermOrder(attrKey);
      grouped.set(
        attrKey,
        slugs.map((slug) => variableProduct.getTerm(slug)!).filter(Boolean)
      );
    }
    return grouped;
  }, [variableProduct]);

  // Accessors
  const byId = React.useCallback(
    (id: number) => variationById.get(id),
    [variationById]
  );

  const variationSetForTerm = React.useCallback(
    (_attr: string, termSlug: string): ReadonlySet<number> => {
      // attr kept for API compatibility; resolution now lives in the model
      return variableProduct.getVariationSetForTerm(termSlug);
    },
    [variableProduct]
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
    variationSetForTerm,
    pricesForIds,
    availabilityForIds,
    termsByAttribute,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
