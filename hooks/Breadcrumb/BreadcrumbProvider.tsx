import { Category, Product } from '@/types';
import { router } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface BreadcrumbContextType {
    categories: Category[];
    product: Product | null;
    setCategories: (categories: Category[], go?: boolean) => void;
    addCategory: (category: Category) => void;
    setProduct: (product: Product | null) => void;
    navigateToCategory: (category: Category) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {

    const [categories, setCategoriesState] = useState<Category[]>([]);
    const [product, setProduct] = useState<Product | null>(null);

    const navigateToCategory = useCallback((category: Category) => {
        const categoryIndex = categories.findIndex(c => c.id === category.id);
        if (categoryIndex !== -1) {
            setCategoriesState(categories.slice(0, categoryIndex + 1));
        }
        router.push(`/category?id=${category.id}&name=${category.name}`);
    }, [categories]);

    const setCategories = useCallback((newCategories: Category[], go = true) => {
        setProduct(null);
        setCategoriesState(newCategories);

        if (go && newCategories.length > 0) {
            navigateToCategory(newCategories[newCategories.length - 1]);
        }
    }, [navigateToCategory]);

    const addCategory = useCallback((category: Category) => {
        setProduct(null);

        const lastCategory = categories[categories.length - 1];

        let newTrail = [category];

        if (lastCategory && category.parent === lastCategory.id) {
            newTrail = [...categories, category];
        }

        setCategoriesState(newTrail);
        navigateToCategory(category);

    }, [categories, navigateToCategory]);

    useEffect(() => {
        console.log('categories updated', categories.map(category => category.name));
    }, [categories]);

    return (
        <BreadcrumbContext.Provider value={{ categories, product, setCategories, addCategory, setProduct, navigateToCategory }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumbs = () => {
    const context = useContext(BreadcrumbContext);
    if (context === undefined) {
        throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
    }
    return context;
};

export const useProductBreadcrumb = (product: Product | null) => {
    const { setProduct } = useBreadcrumbs();
    useEffect(() => {
        if (product) {
            setProduct(product);
        }
    }, [product, setProduct]);
};
