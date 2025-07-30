import { Category } from '@/types';
import React from 'react';
import { XStack } from 'tamagui';
import { RecursiveBreadcrumb } from './RecursiveBreadcrumb';

interface BreadcrumbsProps {
    category: Category;
    isLastClickable?: boolean;
}

export const Breadcrumbs = React.memo(({ category, isLastClickable = false }: BreadcrumbsProps) => {
    return (
        <XStack ai="center" flexWrap="wrap">
            <RecursiveBreadcrumb category={category} isLast={true} isLastClickable={isLastClickable} />
        </XStack>
    );
});
