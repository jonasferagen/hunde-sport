// VariableProductProvider.tsx
import React, { createContext, useContext, useMemo } from "react";

import { getProductPriceRange } from "@/domain/pricing/PriceBook";
import type { ProductPriceRange, ProductPrices } from "@/domain/pricing/types";
import type { Variation } from "@/domain/product";
import {
  useProductVariation,
  useProductVariations,
} from "@/hooks/data/Product";
import { useAutoPaginateQueryResult } from "@/lib/query/query";
import { type Product, ProductVariation } from "@/types";

interface ProductContextType {
  product: Product;
  productVariations: ReadonlyMap<string, ProductVariation>;
  productPriceRange: ProductPriceRange | null;
  findPriceRange: (
    variations: ReadonlySet<Variation>
  ) => ProductPriceRange | null;
  isLoading: boolean;
  isPriceRangeLoading: boolean;
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

  const { data: min, isLoading: isLoadingMin } = useProductVariation(product, {
    order: "asc",
  });
  const { data: max, isLoading: isLoadingMax } = useProductVariation(product, {
    order: "desc",
  });

  const isPriceRangeLoading = isLoadingMin || isLoadingMax;

  const productPriceRange = useMemo(() => {
    if (min && max) {
      return getProductPriceRange([min.prices, max.prices]);
    }
    return null;
  }, [min, max]);

  const findPriceRange = useMemo(
    () => (variations: ReadonlySet<Variation>) => {
      const prices = Array.from(variations)
        .map((variation) => productVariations.get(variation.key)!.prices)
        .filter(Boolean) as ProductPrices[];

      return prices.length ? getProductPriceRange(prices) : null;
    },
    [productVariations]
  );

  const value = useMemo(
    () => ({
      product,
      productVariations,
      isPriceRangeLoading,
      productPriceRange,
      findPriceRange,
      isLoading,
    }),
    [
      product,
      isPriceRangeLoading,
      productVariations,
      productPriceRange,
      findPriceRange,
      isLoading,
    ]
  );

  return <ProductCtx.Provider value={value}>{children}</ProductCtx.Provider>;
});
