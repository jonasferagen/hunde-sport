import { breadcrumbHelper } from '@/config/navigation';
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
    setCategories: (categories: Category[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
    const [categories, setCategoriesState] = useState<Category[]>([]);
    const { trail, build } = useBuildTrail();

    useEffect(() => {
        breadcrumbHelper.register(build);
    }, [build]);

    // When the trail is fetched, update the context state
    useEffect(() => {
        if (trail) {
            setCategoriesState(trail);
        }
    }, [trail]);

    const setCategories = useCallback((newCategories: Category[]) => {
        setCategoriesState(newCategories);
    }, []);

    const value = {
        categories,
        setCategories,
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
