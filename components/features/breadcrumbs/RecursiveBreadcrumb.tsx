import { useCategory } from '@/hooks/data/Category';
import React, { JSX } from 'react';
import { Breadcrumb } from './Breadcrumb';

interface RecursiveBreadcrumbProps {
    categoryId: number;
    isLast?: boolean;
    isLastClickable?: boolean;
}

export const RecursiveBreadcrumb = ({ categoryId, isLast = false, isLastClickable = false }: RecursiveBreadcrumbProps): JSX.Element | null => {
    const { category, isLoading, isError } = useCategory(categoryId);

    if (isLoading) {
        return <Breadcrumb loading />;
    }

    if (isError || !category) {
        return null;
    }

    return (
        <>
            {category.parent && category.parent !== 0 ? <RecursiveBreadcrumb categoryId={category.parent} isLast={false} isLastClickable={isLastClickable} /> : null}
            <Breadcrumb category={category} isLast={isLast} isLastClickable={isLastClickable} />
        </>
    );
};
