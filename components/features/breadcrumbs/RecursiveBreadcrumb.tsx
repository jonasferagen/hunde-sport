import { Category } from '@/models/Category';
import { useCategoryStore } from '@/stores/CategoryStore';
import React, { JSX } from 'react';
import { Breadcrumb } from './Breadcrumb';

interface RecursiveBreadcrumbProps {
    category: Category;
    isLast?: boolean;
    isLastClickable?: boolean;
}

export const RecursiveBreadcrumb = ({
    category,
    isLast = false,
    isLastClickable = false,
}: RecursiveBreadcrumbProps): JSX.Element | null => {
    const { getCategoryById, isLoading } = useCategoryStore();

    if (isLoading) {
        return <Breadcrumb loading />;
    }

    if (!category) {
        return null;
    }

    const parentCategory = getCategoryById(category.parent);

    return (
        <>
            {parentCategory && parentCategory.id !== 0 ? (
                <RecursiveBreadcrumb
                    category={parentCategory}
                    isLast={false}
                    isLastClickable={isLastClickable}
                />
            ) : null}
            <Breadcrumb category={category} isLast={isLast} isLastClickable={isLastClickable} />
        </>
    );
};
