// hooks/useProductCategoryData.ts
import { useProductCategoryStore } from '@/stores/productCategoryStore';
import { useMemo } from 'react';

export function useProductCategoryData(productCategoryId = 0) {
    const categories = useProductCategoryStore((s) => s.productCategories);
    const productCategory = useMemo(
        () => categories.find((c) => c.id === productCategoryId),
        [categories, productCategoryId]
    );
    const productCategories = useMemo(
        () => categories.filter((c) => c.parent === (productCategory?.id ?? 0) && c.shouldDisplay()),
        [categories, productCategory?.id]
    );
    return { productCategory, productCategories };
}