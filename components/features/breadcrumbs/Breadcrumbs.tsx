import React from 'react';
import { XStack } from 'tamagui';
import { RecursiveBreadcrumb } from './RecursiveBreadcrumb';

interface BreadcrumbsProps {
    categoryId: number;
    isLastClickable?: boolean;
}

export const Breadcrumbs = React.memo(({ categoryId, isLastClickable = false }: BreadcrumbsProps) => {
    return (
        <XStack ai="center" flexWrap="wrap">
            <RecursiveBreadcrumb categoryId={categoryId} isLast={true} isLastClickable={isLastClickable} />
        </XStack>
    );
});
