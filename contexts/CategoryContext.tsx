import { useCategories, useCategory as useCategoryData } from '@/hooks/data/Category';
import { Category } from '@/models/Category';
import React, { createContext, useContext } from 'react';

export interface CategoryContextType {
    category?: Category;
    subCategories: Category[];
    isLoading: boolean;
    isSubCategoriesLoading: boolean;
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
    const { category, isLoading } = useCategoryData(categoryId);

    const { items: categories, isLoading: isSubCategoriesLoading } = useCategories();

    const subCategories = categories ? categories.filter(cat => cat.parent === categoryId && cat.shouldDisplay()) : [];

    const value: CategoryContextType = {
        category,
        subCategories,
        isLoading,
        isSubCategoriesLoading,
    };

    return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};
