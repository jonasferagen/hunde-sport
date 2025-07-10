import { Category } from '@/types';
import { ItemCache } from '@/utils/itemCache';
import React from 'react';
import { fetchCategory } from './CategoryApi';

interface CategoryContextType {
    getCategoryById: (id: number) => Promise<Category | null>;
    hydrateCache: (items: Category[]) => void;
}

const CategoryContext = React.createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // The ItemCache is now responsible for fetching a single category.
    const { getItem: getCategoryById, hydrateCache } = ItemCache<Category>(fetchCategory);

    return (
        <CategoryContext.Provider value={{ getCategoryById, hydrateCache }}>
            {children}
        </CategoryContext.Provider>
    );
};

export default CategoryContext;