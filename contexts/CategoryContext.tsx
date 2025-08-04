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
    categoryId?: number;
    categories?: ProductCategory[];
    children: React.ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({
    categoryId,
    categories,
    children,
}) => {
    const {
        getCategoryById,
        getSubCategories,
        isLoading,
    } = useCategoryStore();

    // If categoryId is provided, it takes precedence and fetches from the store.
    const category = getCategoryById(categoryId ?? 0);
    // Use passed-in categories if available, otherwise derive from parent category.
    const value: CategoryContextType = {
        category,
        categories: categories ?? getSubCategories(category?.id ?? 0),
        isLoading,
    };

    return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};
