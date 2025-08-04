import { Category } from '@/models/Category';
import { useCategoryStore } from '@/stores/CategoryStore';
import React, { createContext, useContext } from 'react';

export interface CategoryContextType {
    category?: Category;
    subCategories: Category[];
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

export const CategoryProvider: React.FC<{ categoryId: number; children: React.ReactNode }> = ({
    categoryId,
    children,
}) => {
    const {
        getCategoryById,
        getSubCategories,
        isLoading,
    } = useCategoryStore();

    const category = getCategoryById(categoryId);
    const subCategories = getSubCategories(categoryId);

    const value: CategoryContextType = {
        category,
        subCategories,
        isLoading,
    };

    return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};
