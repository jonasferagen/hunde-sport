import { useCategory } from '@/hooks/data/Category';
import { Category } from '@/types';
import React, { JSX } from 'react';
import { Breadcrumb } from './Breadcrumb';

interface RecursiveBreadcrumbProps {
    category: Category;
    isLast?: boolean;
    isLastClickable?: boolean;
}

export const RecursiveBreadcrumb = ({ category,
    isLast = false,
    isLastClickable = false
}: RecursiveBreadcrumbProps): JSX.Element | null => {

    const { category: parentCategory, isLoading, isError } = useCategory(category.parent);

    if (isLoading) {
        return <Breadcrumb loading />;
    }

    if (isError || !category) {
        return null;
    }

    return (
        <>
            {parentCategory && parentCategory.id !== 0 ? (
                <RecursiveBreadcrumb category={parentCategory} isLast={false} isLastClickable={isLastClickable} />
            ) : null}
            <Breadcrumb category={category} isLast={isLast} isLastClickable={isLastClickable} />
        </>
    );
};
