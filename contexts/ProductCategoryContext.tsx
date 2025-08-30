// ProductCategoryProvider.tsx
import React, { createContext, useContext, useMemo } from "react";

import { ProductCategory } from "@/domain/product-category/ProductCategory";
import {
  useProductCategories,
  useProductCategory,
} from "@/stores/productCategoryStore";

interface ProductCategoryContextType {
  /** Always defined (dummy root when id=0/missing) */
  productCategory: ProductCategory;
  /** Already filtered by shouldDisplay in the store */
  productCategories: readonly ProductCategory[];
}

const Ctx = createContext<ProductCategoryContextType | undefined>(undefined);

export const useProductCategoryContext = () => {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error(
      "useProductCategoryContext must be used within a ProductCategoryProvider"
    );
  return ctx;
};

export const ProductCategoryProvider = React.memo(
  function ProductCategoryProvider({
    productCategoryId,
    children,
  }: {
    productCategoryId: number;
    children: React.ReactNode;
  }) {
    const productCategory = useProductCategory(productCategoryId);
    const sub = useProductCategories(productCategory.id);

    const value = useMemo(
      () => ({ productCategory, productCategories: sub }),
      [productCategory, sub]
    );
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
  }
);
