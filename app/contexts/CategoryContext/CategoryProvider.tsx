import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Category } from '../../../types';
import { usePaginatedResource } from '../usePaginatedResource';
import { fetchCategoryData } from './categoryApi';
import type { CategoryContextType } from './categoryTypes';

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeParentId, setActiveParentId] = useState<number>(0);

    const {
        getState: getCategoryState,
        loadMore,
        refresh,
    } = usePaginatedResource<Category>(fetchCategoryData, () => activeParentId.toString());

    useEffect(() => {
        refresh(activeParentId);
    }, [activeParentId]);

    return (
        <CategoryContext.Provider value={{ getCategoryState, loadMore, refresh, setParentId: setActiveParentId }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = (parentId: number) => {
    const context = useContext(CategoryContext);
    if (!context) throw new Error('useCategories must be used within a CategoryProvider');

    const state = context.getCategoryState(parentId);

    return {
        ...state,
        categories: state.items, // optional alias
        loadMore: () => context.loadMore(parentId),
        refresh: () => context.refresh(parentId),
        setParentId: context.setParentId,
    };
};

export default CategoryProvider;