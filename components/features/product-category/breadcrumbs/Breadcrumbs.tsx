import { ThemedXStack } from '@/components/ui';
import { useProductCategoryContext } from '@/contexts/ProductCategoryContext';
import { useBreadcrumbTrail } from '@/stores/productCategoryStore';
import React from 'react';
import { Breadcrumb } from './Breadcrumb';

interface BreadcrumbsProps {
    isLastClickable?: boolean;
}

export const Breadcrumbs = React.memo(({ isLastClickable = false }: BreadcrumbsProps) => {
    const { productCategory } = useProductCategoryContext();
    const trail = useBreadcrumbTrail(productCategory.id);

    return (trail.length > 0 ?
        <ThemedXStack gap="none" ai="center" fw="wrap">
            {trail.slice(1).map((breadcrumbCategory, index) => (
                <Breadcrumb
                    key={breadcrumbCategory.id}
                    productCategory={breadcrumbCategory}
                    isLast={index === trail.slice(1).length - 1}
                    isLastClickable={isLastClickable}
                />
            ))}
        </ThemedXStack>
        : null);
});

