// domain/pricing/useProductPriceRange.ts
import { useMemo } from "react";

import type {
  ProductPriceRange,
  ProductPriceRange as ProductPriceRangeType,
  ProductPrices,
} from "@/domain/pricing/types";
import { useProductVariation } from "@/hooks/data/Product"; // adjust path
import { VariableProduct } from "@/types";

export type UseProductPriceRangeResult = {
  productPriceRange: ProductPriceRangeType | null;
  isLoading: boolean;
  error?: unknown;
};

export function useProductPriceRange(
  variableProduct: VariableProduct
): UseProductPriceRangeResult {
  const {
    data: minVariation,
    isLoading: isLoadingMin,
    error: errorMin,
  } = useProductVariation(variableProduct, { order: "asc" });

  const {
    data: maxVariation,
    isLoading: isLoadingMax,
    error: errorMax,
  } = useProductVariation(variableProduct, { order: "desc" });

  const isLoading: boolean = isLoadingMin || isLoadingMax;
  const error: unknown = errorMin ?? errorMax ?? undefined;

  const productPriceRange: ProductPriceRangeType | null = useMemo(() => {
    if (!minVariation?.prices || !maxVariation?.prices) return null;
    return getProductPriceRange([minVariation.prices, maxVariation.prices]);
  }, [minVariation, maxVariation]);

  return { productPriceRange, isLoading, error };
}

export function getProductPriceRange(
  prices: ProductPrices[]
): ProductPriceRange {
  if (prices.length === 0) {
    throw new Error("No prices provided");
  }

  // Keep only valid, non-zero prices
  const valid = prices.filter((p) => {
    const n = Number(p.price);
    return Number.isFinite(n) && n !== 0;
  });

  // If no valid prices, fall back to the first element
  const list = valid.length > 0 ? valid : [prices[0]];

  // Seed min/max with the first item to avoid nulls
  let min = list[0];
  let max = list[0];

  for (let i = 1; i < list.length; i++) {
    const p = list[i];
    const n = Number(p.price);
    if (n < Number(min.price)) {
      min = p;
    }
    if (n > Number(max.price)) {
      max = p;
    }
  }

  return { min, max };
}
