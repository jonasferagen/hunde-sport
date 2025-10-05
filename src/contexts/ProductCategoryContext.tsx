// ProductCategoryProvider.tsx
import React, { createContext, useMemo } from "react";

import { ProductCategory } from "@/domain/ProductCategory";
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
      [productCategory, sub],
    );
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
  },
);
