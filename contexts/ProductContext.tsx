// VariableProductProvider.tsx
import React, { createContext, useContext, useMemo } from "react";

import type { Variation } from "@/domain/product";
import { useProductVariations } from "@/hooks/api/data/product/queries";
import { useAutoPaginateQueryResult } from "@/lib/api/query";
import { type Product, ProductVariation } from "@/types";

interface ProductContextType {
  product: Product;
  productVariations: ReadonlyMap<string, ProductVariation>;
  findByVariations: (variations: ReadonlySet<Variation>) => ProductVariation[];
  isLoading: boolean;
}

const ProductCtx = createContext<ProductContextType | undefined>(undefined);

export const useProductProvider = () => {
  const ctx = useContext(ProductCtx);
  if (!ctx)
    throw new Error("useProductContext must be used within a ProductProvider");
  return ctx;
};

export const ProductProvider = React.memo(function ProductProvider({
  product,
  children,
}: {
  product: Product;
  children: React.ReactNode;
}) {
  // Fetch product variations
  const result = useProductVariations(product);
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
    [productVariations],
  );

  const value = useMemo(
    () => ({
      product,
      productVariations,
      isLoading,
      findByVariations,
    }),
    [product, productVariations, isLoading, findByVariations],
  );

  return <ProductCtx.Provider value={value}>{children}</ProductCtx.Provider>;
});
