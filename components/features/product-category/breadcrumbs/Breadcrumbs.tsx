import { ThemedXStack } from '@/components/ui';
import { useProductCategoryContext } from '@/contexts/ProductCategoryContext';
import { useProductCategoryStore } from '@/stores/productCategoryStore';
import { ProductCategory } from '@/types';
import React, { useMemo } from 'react';
import { Breadcrumb } from './Breadcrumb';

interface BreadcrumbsProps {
    isLastClickable?: boolean;
}

export const Breadcrumbs = React.memo(({ isLastClickable = false }: BreadcrumbsProps) => {
    const { productCategory } = useProductCategoryContext();
    const trail = getBreadcrumbTrail(productCategory?.id ?? 0);

    return (
        <ThemedXStack gap="none" ai="center" fw="wrap">
            {trail.map((breadcrumbCategory, index) => (
                <Breadcrumb
                    key={breadcrumbCategory.id}
                    productCategory={breadcrumbCategory}
                    isLast={index === trail.length - 1}
                    isLastClickable={isLastClickable}
                />
            ))}
        </ThemedXStack>
    );
});

const getBreadcrumbTrail = (productCategoryId: number) => {
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