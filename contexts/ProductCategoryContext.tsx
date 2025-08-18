// ProductCategoryProvider.tsx
import { ProductCategory } from '@/domain/ProductCategory';
import { useProductCategoryStore } from '@/stores/productCategoryStore';
import React, { createContext, useContext, useMemo } from 'react';

interface ProductCategoryContextType {
    productCategory?: ProductCategory;
    productCategories: ProductCategory[];
}

const Ctx = createContext<ProductCategoryContextType | undefined>(undefined);

export const useProductCategoryContext = () => {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useProductCategoryContext must be used within a ProductCategoryProvider');
    return ctx;
};

export const ProductCategoryProvider = React.memo(
    ({ productCategoryId = 0, children }: { productCategoryId?: number; children: React.ReactNode }) => {
        const categories = useProductCategoryStore((s) => s.productCategories);

        const productCategory = productCategoryId ? useMemo(
            () => categories.find((c) => c.id === productCategoryId),
            [categories, productCategoryId]
        ) : undefined;
        const sub = useMemo(
            () => categories.filter((c) => c.parent === (productCategory?.id ?? 0) && c.shouldDisplay()),
            [categories, productCategory?.id]
        );

        const value = useMemo(
            () => ({ productCategory, productCategories: sub }),
            [productCategory, sub]
        );

        return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
    }
);
