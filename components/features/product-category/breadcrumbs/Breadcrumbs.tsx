import { ThemedXStack } from '@/components/ui';
import { useBreadcrumbTrail } from '@/stores/productCategoryStore';
import React from 'react';
import { Breadcrumb } from './Breadcrumb';
import { ProductCategory } from '@/types';

interface BreadcrumbsProps {
    isLastClickable?: boolean;
    productCategory: ProductCategory;
}

export const Breadcrumbs = React.memo(({ isLastClickable = false, productCategory }: BreadcrumbsProps) => {

    const trail = useBreadcrumbTrail(productCategory.id);

    return (trail.length > 0 ?
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
        : null);
});

