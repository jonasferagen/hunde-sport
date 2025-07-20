import { useCategory } from '@/hooks/Category';
import React, { JSX } from 'react';
import { Breadcrumb } from './Breadcrumb';

interface RecursiveBreadcrumbProps {
    categoryId: number;
    isCurrent?: boolean;
}

export const RecursiveBreadcrumb = ({ categoryId, isCurrent = false }: RecursiveBreadcrumbProps): JSX.Element | null => {
    const { category, isLoading, isError } = useCategory(categoryId);

    if (isLoading) {
        return <Breadcrumb loading />;
    }

    if (isError || !category) {
        return null;
    }

    return (
        <>
            {category.parent && category.parent !== 0 ? <RecursiveBreadcrumb categoryId={category.parent} /> : null}
            <Breadcrumb category={category} isCurrent={isCurrent} />
        </>
    );
};
