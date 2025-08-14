import { ThemedXStack } from '@/components/ui';
import { useProductCategoryContext } from '@/contexts/ProductCategoryContext';
import { useProductCategoryStore } from '@/stores/productCategoryStore';
import React from 'react';
import { Breadcrumb } from './Breadcrumb';

interface BreadcrumbsProps {
    isLastClickable?: boolean;
}

export const Breadcrumbs = React.memo(({ isLastClickable = false }: BreadcrumbsProps) => {
    const { productCategory } = useProductCategoryContext();
    const getBreadcrumbTrail = useProductCategoryStore((state) => state.getBreadcrumbTrail);
    const trail = productCategory ? getBreadcrumbTrail(productCategory.id) : [];

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