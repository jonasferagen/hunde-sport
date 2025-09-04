import React from "react";

import type {
  ProductAvailability,
  ProductPrices,
  VariableProduct,
  VariableProductVariant,
} from "@/types";

export type VariableProductCtx = {
  variableProduct: VariableProduct;
  isLoading: boolean;
  productVariations: VariableProductVariant[];
  // Lookups
  byId: (id: number) => VariableProductVariant | undefined;

  // Display helpers (accept arrays you create at the edge)
  pricesForIds: (ids: number[]) => ProductPrices[];
  availabilityForIds: (ids: number[]) => ProductAvailability[];
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
  productVariations: VariableProductVariant[]; // hydrated; includes prices/availability
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
    const m = new Map<number, VariableProductVariant>();
    for (const v of productVariations) m.set(v.id, v);
    return m;
  }, [productVariations]);

  // Accessors
  const byId = React.useCallback(
    (id: number) => variationById.get(id),
    [variationById]
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
    pricesForIds,
    availabilityForIds,
    productVariations,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
