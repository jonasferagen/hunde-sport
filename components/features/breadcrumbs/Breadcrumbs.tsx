import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useProductCategoryContext } from '@/contexts/ProductCategoryContext';
import { useProductCategoryStore } from '@/stores/ProductCategoryStore';
import React from 'react';
import { XStack } from 'tamagui';
import { Breadcrumb } from './Breadcrumb';

interface BreadcrumbsProps {
    isLastClickable?: boolean;
}

export const Breadcrumbs = React.memo(({ isLastClickable = false }: BreadcrumbsProps) => {
    const { productCategory: category } = useProductCategoryContext();
    const getBreadcrumbTrail = useProductCategoryStore((state) => state.getBreadcrumbTrail);
    const isLoading = useProductCategoryStore((state) => state.isLoading);

    if (isLoading) {
        return <ThemedSpinner />
    }

    const trail = category ? getBreadcrumbTrail(category.id) : [];

    return (
        <XStack ai="center" fw="wrap">
            {trail.map((breadcrumbCategory, index) => (
                <Breadcrumb
                    key={breadcrumbCategory.id}
                    category={breadcrumbCategory}
                    isLast={index === trail.length - 1}
                    isLastClickable={isLastClickable}
                />
            ))}
        </XStack>
    );
});