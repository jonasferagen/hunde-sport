
import { ProductCategory } from '@/domain/ProductCategory';
import { useProductCategoryStore } from '@/stores/productCategoryStore';
import { useMemo } from 'react';


export function useBreadcrumbTrail(productCategoryId: number) {
    const categories = useProductCategoryStore((s) => s.productCategories);
    return useMemo(() => {
        const byId = new Map<number, ProductCategory>(categories.map((c) => [c.id, c]));
        const trail: ProductCategory[] = [];
        let current = byId.get(productCategoryId);
        while (current && current.id !== 0) {
            trail.unshift(current);
            current = byId.get(current.parent);
        }
        return trail;
    }, [categories, productCategoryId]);
}
