// domain/pricing/useProductPriceRange.ts
import { useMemo } from "react";

import { PriceBook } from "@/domain/pricing/PriceBook";
import type {
  ProductPriceRange,
  ProductPriceRange as ProductPriceRangeType,
} from "@/domain/pricing/types";
import { useProductVariation } from "@/hooks/data/product/queries"; // adjust path
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
    data: minV,
    isLoading: l1,
    error: e1,
  } = useProductVariation(variableProduct, { order: "asc" });
  const {
    data: maxV,
    isLoading: l2,
    error: e2,
  } = useProductVariation(variableProduct, { order: "desc" });

  const isLoading = l1 || l2;
  const error = e1 ?? e2 ?? undefined;

  const productPriceRange = useMemo<ProductPriceRange | null>(() => {
    if (!minV?.prices || !maxV?.prices) return null;
    const minPB = PriceBook.from(minV.prices);
    const maxPB = PriceBook.from(maxV.prices);
    return PriceBook.getProductPriceRange([minPB, maxPB]);
  }, [minV, maxV]);

  return { productPriceRange, isLoading, error };
}
