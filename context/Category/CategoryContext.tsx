import type { Category } from '@/types';
import { ItemCache } from '@/utils/itemCache';
import PaginatorResource from '@/utils/paginatorResource';
import React, { createContext } from 'react';
import { fetchCategoryByCategory } from './CategoryApi';

interface CategoryState {
    items: Category[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}

interface CategoryContextType {
    getState: (productCategoryId: number) => CategoryState;
    loadMore: (productCategoryId: number) => void;
    refresh: (productCategoryId: number) => void;
    getCategoryById: (id: number) => Promise<Category | null>;
    hydrateCache: (items: Category[]) => void;
}

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        getState,
        loadMore,
        refresh,
    } = PaginatorResource<Category>(fetchCategoryByCategory);

    const { getItem: getCategoryById, hydrateCache } = ItemCache<Category>(async (id: number) => {
        // This could be implemented to fetch a single category from the API if needed
        return Promise.reject('Single category fetch not implemented');
    });

    return (
        <CategoryContext.Provider value={{ getState, loadMore, refresh, getCategoryById, hydrateCache }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export default CategoryContext;