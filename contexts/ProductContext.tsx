// VariableProductProvider.tsx
import React, { createContext, useContext, useMemo } from "react";

import type { ProductPrices } from "@/domain/pricing/types";
import { useProductVariations } from "@/hooks/data/Product";
import { useAutoPaginateQueryResult } from "@/lib/query/query";
import { type Product, ProductVariation, VariableProduct } from "@/types";

interface ProductContextType {
  product: Product;
  productVariations: ReadonlyMap<string, ProductVariation>;
  productVariationPrices: ProductPrices[];
  isLoading: boolean;
}

const ProductCtx = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
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
  const result = useProductVariations(product as VariableProduct);

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

  const productVariationPrices = useMemo(
    () => _productVariations.map((p) => p.prices),
    [_productVariations]
  );

  const value = useMemo(
    () => ({ product, productVariations, productVariationPrices, isLoading }),
    [product, productVariations, productVariationPrices, isLoading]
  );

  return <ProductCtx.Provider value={value}>{children}</ProductCtx.Provider>;
});
