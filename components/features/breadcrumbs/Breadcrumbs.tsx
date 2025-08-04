import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useCategoryContext } from '@/contexts/CategoryContext';
import { useCategoryStore } from '@/stores/CategoryStore';
import React from 'react';
import { XStack } from 'tamagui';
import { Breadcrumb } from './Breadcrumb';

interface BreadcrumbsProps {
    isLastClickable?: boolean;
}

export const Breadcrumbs = React.memo(({ isLastClickable = false }: BreadcrumbsProps) => {
    const { category } = useCategoryContext();
    const getBreadcrumbTrail = useCategoryStore((state) => state.getBreadcrumbTrail);
    const isLoading = useCategoryStore((state) => state.isLoading);

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