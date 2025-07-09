import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Category } from '../../../types';
import { usePaginatedResource } from '../usePaginatedResource';
import { fetchCategoryData } from './categoryApi';
import type { CategoryContextType } from './categoryTypes';

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeCategoryId, setActiveCategoryId] = useState<number>(0);

    const {
        getState: getCategoryState,
        loadMore,
        refresh,
    } = usePaginatedResource<Category>(fetchCategoryData, () => activeCategoryId.toString());

    useEffect(() => {
        refresh(activeCategoryId);
    }, [activeCategoryId]);

    return (
        <CategoryContext.Provider value={{ getCategoryState, loadMore, refresh, setCategoryId: setActiveCategoryId }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = (CategoryId: number) => {
    const context = useContext(CategoryContext);
    if (!context) throw new Error('useCategories must be used within a CategoryProvider');

    const state = context.getCategoryState(CategoryId);

    return {
        ...state,
        categories: state.items, // optional alias
        loadMore: () => context.loadMore(CategoryId),
        refresh: () => context.refresh(CategoryId),
        setCategoryId: context.setCategoryId,
    };
};

export default CategoryProvider;