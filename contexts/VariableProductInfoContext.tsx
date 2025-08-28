// @/contexts/VariableProductInfoContext.tsx
import React from "react";

import type { ProductPrices } from "@/domain/pricing";
import type { ProductAvailability } from "@/domain/Product/BaseProduct";
import { ProductVariation } from "@/domain/Product/ProductVariation";
import { VariableProduct } from "@/domain/Product/VariableProduct";
import { useProductVariations } from "@/hooks/data/Product";

type Ctx = {
  isLoading: boolean;
  byId: Map<number, ProductVariation>;
  allVariantIds: number[];
  pricesForIds: (ids: number[]) => ProductPrices[];
  availabilityForIds: (ids: number[]) => ProductAvailability[];
};

const VariableProductInfoContext = React.createContext<Ctx | null>(null);

export function VariableProductInfoProvider({
  variableProduct,
  children,
}: {
  variableProduct: VariableProduct;
  children: React.ReactNode;
}) {
  const { items: productVariations = [], isLoading } =
    useProductVariations(variableProduct);

  // stable signature based on IDs
  const idsSig = React.useMemo(
    () => productVariations.map((v) => v.id).join(","),
    [productVariations]
  );

  const byId = React.useMemo(() => {
    const m = new Map<number, ProductVariation>();
    for (const v of productVariations) m.set(v.id, v);
    return m;
  }, [idsSig]);

  const allVariantIds = React.useMemo(
    () => productVariations.map((v) => v.id),
    [idsSig]
  );

  const pricesForIds = React.useCallback(
    (ids: number[]): ProductPrices[] =>
      ids.map((id) => byId.get(id)?.prices).filter(Boolean) as ProductPrices[],
    [byId]
  );

  const availabilityForIds = React.useCallback(
    (ids: number[]): ProductAvailability[] =>
      ids
        .map((id) => byId.get(id)?.availability)
        .filter(Boolean) as ProductAvailability[],
    [byId]
  );

  const value = React.useMemo<Ctx>(
    () => ({
      isLoading,
      byId,
      allVariantIds,
      pricesForIds,
      availabilityForIds,
    }),
    [isLoading, byId, allVariantIds, pricesForIds, availabilityForIds]
  );

  if (isLoading) return null;

  return (
    <VariableProductInfoContext.Provider value={value}>
      {children}
    </VariableProductInfoContext.Provider>
  );
}

export function useVariableProductInfoCtx(): Ctx {
  const ctx = React.useContext(VariableProductInfoContext);
  if (!ctx) {
    throw new Error(
      "useVariableProductInfoCtx must be used inside <VariableProductInfoProvider>"
    );
  }
  return ctx;
}
