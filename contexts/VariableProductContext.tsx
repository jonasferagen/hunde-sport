// VariableProductProvider.tsx
import React, { createContext, useContext, useMemo } from "react";

import type { Variation } from "@/domain/product";
import { useProductVariations } from "@/hooks/data/product/queries";
import { useAutoPaginateQueryResult } from "@/lib/query/query";
import { ProductVariation, VariableProduct } from "@/types";

interface VariableProductContextType {
  variableProduct: VariableProduct;
  productVariations: ReadonlyMap<string, ProductVariation>;
  findByVariations: (variations: ReadonlySet<Variation>) => ProductVariation[];
  isLoading: boolean;
}

const VariableProductCtx = createContext<
  VariableProductContextType | undefined
>(undefined);

export const useVariableProductContext = () => {
  const ctx = useContext(VariableProductCtx);
  if (!ctx)
    throw new Error(
      "useVariableProductContext must be used within a VariableProductProvider"
    );
  return ctx;
};

export const VariableProductProvider = React.memo(
  function VariableProductProvider({
    variableProduct,
    children,
  }: {
    variableProduct: VariableProduct;
    children: React.ReactNode;
  }) {
    // Fetch product variations
    const result = useProductVariations(variableProduct);
    useAutoPaginateQueryResult(result); // default enabled
    const { isLoading, items: _productVariations } = result;

    // Convert to a stable ReadonlyMap
    const productVariations = useMemo(() => {
      const m = new Map<string, ProductVariation>();
      if (_productVariations) {
        for (const v of _productVariations) {
          m.set(String(v.id), v);
        }
      }
      return m as ReadonlyMap<string, ProductVariation>;
    }, [_productVariations]);

    const findByVariations = useMemo(
      () => (variations: ReadonlySet<Variation>) => {
        const _productVariations = Array.from(variations)
          .map((variation) => productVariations.get(variation.key)!)
          .filter(Boolean) as ProductVariation[];

        return _productVariations;
      },
      [productVariations]
    );

    const value = useMemo(
      () => ({
        variableProduct,
        productVariations,
        isLoading,
        findByVariations,
      }),
      [variableProduct, productVariations, isLoading, findByVariations]
    );

    return (
      <VariableProductCtx.Provider value={value}>
        {children}
      </VariableProductCtx.Provider>
    );
  }
);
