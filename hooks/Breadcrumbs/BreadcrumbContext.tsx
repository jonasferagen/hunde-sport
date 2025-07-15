import { routes } from '@/config/routing';
import { useCategoryTrail } from '@/hooks/Category';
import { Category } from '@/types';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// A new hook to manage the trail fetching logic
const useBuildTrail = () => {
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const { data: trail, isLoading } = useCategoryTrail(categoryId);
    return { trail, isLoading, build: setCategoryId };
};

interface BreadcrumbContextType {
    categories: Category[];
    setCategories: (categories: Category[], go?: boolean) => void;
    addCategory: (category: Category) => void;
    navigateToCategory: (category: Category) => void;
    buildTrail: (categoryId: number) => void; // New function to trigger trail building
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
    const [categories, setCategoriesState] = useState<Category[]>([]);
    const { trail, build } = useBuildTrail();

    // When the trail is fetched, update the context state
    useEffect(() => {
        if (trail) {
            setCategoriesState(trail);
        }
    }, [trail]);

    const navigateToCategory = useCallback((category: Category) => {
        const categoryIndex = categories.findIndex(c => c.id === category.id);
        if (categoryIndex !== -1) {
            setCategoriesState(categories.slice(0, categoryIndex + 1));
        }
        routes.category(category.id, category.name);
    }, [categories]);

    const setCategories = useCallback((newCategories: Category[], go = true) => {
        setCategoriesState(newCategories);
        if (go && newCategories.length > 0) {
            const lastCategory = newCategories[newCategories.length - 1];
            routes.category(lastCategory.id, lastCategory.name);
        }
    }, []);

    const addCategory = useCallback((category: Category) => {
        setCategoriesState(prev => [...prev, category]);
        routes.category(category.id, category.name);
    }, []);

    const value = {
        categories,
        setCategories,
        addCategory,
        navigateToCategory,
        buildTrail: build, // Expose the build function
    };

    useEffect(() => {
        console.log('categories updated', categories.map(category => category.name));
    }, [categories]);

    return (
        <BreadcrumbContext.Provider value={value}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumbs = () => {
    const context = useContext(BreadcrumbContext);
    if (!context) {
        throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
    }
    return context;
};
