import React, {
    createContext, useCallback, useContext, useEffect, useState
} from 'react';
import { useBreadcrumbs } from '../BreadcrumbContext/BreadcrumbProvider';
import { fetchCategoryData } from './categoryApi';
import type { CategoryContextType, CategoryState } from './categoryTypes';
import { getKey } from './categoryUtils';

const defaultCategoryState: CategoryState = {
    categories: [],
    loading: false,
    loadingMore: false,
    error: null,
    page: 1,
    hasMore: true,
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categoryData, setCategoryData] = useState<Record<string, CategoryState>>({});
    const [activeParentId, setActiveParentId] = useState<number | null>(null);
    const { setBreadcrumbs } = useBreadcrumbs();

    const fetchCategories = useCallback(async (parentId: number | null, pageNum: number, append = false) => {
        const key = getKey(parentId);
        const currentState = categoryData[key] ?? defaultCategoryState;

        if (!currentState.hasMore && append) return;

        setCategoryData(prev => ({
            ...prev,
            [key]: { ...currentState, loading: pageNum === 1, loadingMore: pageNum > 1, error: null },
        }));

        try {
            const mappedData = await fetchCategoryData(parentId, pageNum);

            setCategoryData(prev => {
                const state = prev[key] ?? defaultCategoryState;
                const newCategories = append ? [...state.categories, ...mappedData] : mappedData;
                return {
                    ...prev,
                    [key]: {
                        ...state,
                        categories: newCategories,
                        page: pageNum + 1,
                        hasMore: mappedData.length > 0,
                        loading: false,
                        loadingMore: false,
                    },
                };
            });
        } catch (err) {
            setCategoryData(prev => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    error: err instanceof Error ? err.message : 'An unknown error occurred',
                    loading: false,
                    loadingMore: false,
                },
            }));
        }
    }, [categoryData]);

    useEffect(() => {
        const key = getKey(activeParentId);
        if (!categoryData[key]) {
            fetchCategories(activeParentId, 1, false);
        }
    }, [activeParentId]);

    const loadMore = useCallback(async (parentId: number | null) => {
        const key = getKey(parentId);
        const state = categoryData[key] ?? defaultCategoryState;
        if (state.loading || state.loadingMore || !state.hasMore) return;
        await fetchCategories(parentId, state.page, true);
    }, [categoryData, fetchCategories]);

    const refresh = useCallback(async (parentId: number | null) => {
        await fetchCategories(parentId, 1, false);
    }, [fetchCategories]);

    const setParentId = useCallback((id: number | null) => {
        setActiveParentId(id);
    }, []);

    const getCategoryState = useCallback((parentId: number | null) => {
        const key = getKey(parentId);
        return categoryData[key] ?? defaultCategoryState;
    }, [categoryData]);

    return (
        <CategoryContext.Provider
            value={{ getCategoryState, loadMore, refresh, setParentId }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = (parentId: number | null) => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategories must be used within a CategoryProvider');
    }
    const state = context.getCategoryState(parentId);
    return {
        ...state,
        loadMore: () => context.loadMore(parentId),
        refresh: () => context.refresh(parentId),
        setParentId: context.setParentId,
    };
};

export default CategoryProvider;