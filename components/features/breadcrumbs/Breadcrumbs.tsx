import { useCategoryContext } from '@/contexts/CategoryContext';
import React from 'react';
import { XStack } from 'tamagui';
import { Breadcrumb } from './Breadcrumb';
import { RecursiveBreadcrumb } from './RecursiveBreadcrumb';

interface BreadcrumbsProps {
    isLastClickable?: boolean;
}

export const Breadcrumbs = React.memo(({ isLastClickable = false }: BreadcrumbsProps) => {

    const { category } = useCategoryContext();

    return (
        <XStack ai="center" flexWrap="wrap">
            {category ? (
                <RecursiveBreadcrumb category={category} isLast={true} isLastClickable={isLastClickable} />
            ) : (
                <Breadcrumb loading />
            )}
        </XStack>
    );
});
