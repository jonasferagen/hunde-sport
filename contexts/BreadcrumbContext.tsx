import { useCategoryTrail } from '@/hooks/Category';
import { Category, Product } from '@/types';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// A new hook to manage the trail fetching logic
const useBuildTrail = () => {
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const { data: trail, isLoading } = useCategoryTrail(categoryId);
    return { trail, isLoading, build: setCategoryId };
};

interface BreadcrumbContextType {
    categories: Category[];
    isLoading: boolean;
    setCategory: (category: Category) => void;
    build: (categoryId: number) => void;
    setProductFallback: (product: Product) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
    const [categories, setCategoriesState] = useState<Category[]>([]);
    const { trail, isLoading, build } = useBuildTrail();

    // When the trail is fetched, update the context state
    useEffect(() => {
        if (trail) {
            setCategoriesState(trail);
        }
    }, [trail]);

    const setCategory = useCallback((category: Category) => {
        setCategoriesState(prevCategories => {
            const lastCrumb = prevCategories[prevCategories.length - 1];

            // If the new category is a child of the last one, just append it.
            if (lastCrumb && category.parent === lastCrumb.id) {
                return [...prevCategories, category];
            }

            // Otherwise, rebuild the whole trail.
            build(category.id);
            return [category]; // Immediately clear breadcrumbs for a clean transition
        });
    }, [build]);

    const setProductFallback = useCallback((product: Product) => {
        const productCategories = product.categories;
        if (productCategories?.length > 0) {
            const lastCrumb = categories[categories.length - 1];

            // If the last breadcrumb is already part of the product's categories, do nothing.
            const isCrumbInProductCategories = productCategories.some(
                (cat) => cat.id === lastCrumb?.id
            );

            if (!isCrumbInProductCategories) {
                build(productCategories[0].id);
            }
        }
    }, [categories, build]);

    const contextValue = useMemo(() => ({
        categories,
        isLoading,
        setCategory,
        build,
        setProductFallback
    }), [categories, isLoading, setCategory, build, setProductFallback]);

    return (
        <BreadcrumbContext.Provider value={contextValue}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumbContext = () => {
    const context = useContext(BreadcrumbContext);
    if (context === undefined) {
        throw new Error('useBreadcrumbContext must be used within a BreadcrumbProvider');
    }
    return context;
};
