
import { Category, Product } from '@/types';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';


interface BreadcrumbContextType {
    categories: Category[];
    setCategory: (category: Category) => void;
    isLoading: boolean;
    setProduct: (product: Product) => void;
    setProductFallback: (product: Product) => void;
}




const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
    const [categories, setCategoriesState] = useState<Category[]>([]);
    const setCategory = useCallback((category: Category) => {
        const lastCrumb = categories[categories.length - 1] ?? null;

        if (category.id === lastCrumb?.id) {
            return;
        }
        // Append if parent matches last crumb
        if (category.parent === lastCrumb?.id) {
            setCategoriesState([...categories, category]);
            return;
        }

        setCategoriesState([category]);

    }, [categories]);

    const setProductFallback = useCallback((product: Product) => {
        /*
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
        } */
    }, [categories]);

    const contextValue = useMemo(() => ({
        categories,
        setCategory,
        isLoading: false,
        setProduct: () => { },
        setProductFallback: () => { }
    }), [categories, setCategory]);

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
