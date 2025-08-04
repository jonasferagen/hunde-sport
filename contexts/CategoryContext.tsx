import { ProductCategory } from '@/models/Category';
import { useCategoryStore } from '@/stores/CategoryStore';
import React, { createContext, useContext } from 'react';

export interface CategoryContextType {
    category?: ProductCategory;
    categories: ProductCategory[];
    isLoading: boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategoryContext = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategoryContext must be used within a CategoryProvider');
    }
    return context;
};

interface CategoryProviderProps {
    category?: ProductCategory;
    categories?: ProductCategory[];
    children: React.ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({
    category,
    categories,
    children,
}) => {
    const {
        getSubCategories,
        isLoading,
    } = useCategoryStore();

    // Use passed-in categories if available, otherwise derive from parent category
    const contextCategories = categories ?? getSubCategories(category ? category.id : 0);

    const value: CategoryContextType = {
        category,
        categories: contextCategories,
        isLoading,
    };

    return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};
