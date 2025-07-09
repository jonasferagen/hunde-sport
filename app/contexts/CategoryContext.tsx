// app/contexts/CategoryContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ENDPOINTS } from '../../config/api';
import type { Breadcrumb, Category } from '../../types';
import apiClient from '../../utils/apiClient';

// Represents the state for a single list of categories (e.g., for one parent category)
interface CategoryState {
  categories: Category[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

// The shape of the data provided by the context
interface CategoryContextType {
  getCategoryState: (parentId: number | null) => CategoryState;
  loadMore: (parentId: number | null) => void;
  refresh: (parentId: number | null) => void;
  setParentId: (id: number | null, name?: string) => void;
  breadcrumbs: Breadcrumb[];
}

const mapToCategory = (item: any): Category => ({
  id: item.id,
  name: item.name,
  parent: item.parent,
  image: item.image,
});

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

const defaultCategoryState: CategoryState = {
  categories: [],
  loading: false,
  loadingMore: false,
  error: null,
  page: 1,
  hasMore: true,
};

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // A map from parentId (or 'root') to the state for that category list
  const [categoryData, setCategoryData] = useState<Record<string, CategoryState>>({});
  const [activeParentId, setActiveParentId] = useState<number | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([{ id: null, name: 'Home' }]);

  const getKey = (parentId: number | null) => parentId?.toString() ?? 'root';

  const fetchCategories = useCallback(async (parentId: number | null, pageNum: number, append = false) => {
    const key = getKey(parentId);
    const currentState = categoryData[key] ?? defaultCategoryState;

    if (!currentState.hasMore && append) return;

    setCategoryData(prev => ({
      ...prev,
      [key]: {
        ...currentState,
        loading: pageNum === 1,
        loadingMore: pageNum > 1,
        error: null,
      },
    }));

    try {
      const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.CATEGORIES.LIST(pageNum, parentId ?? 0)
      );

      if (error) throw new Error(error);

      const mappedData = data?.map(mapToCategory) ?? [];

      setCategoryData(prev => {
        const state = prev[key];
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
    // Fetch categories only if they haven't been loaded before.
    if (!categoryData[key]) {
      fetchCategories(activeParentId, 1, false);
    }
  }, [activeParentId, categoryData, fetchCategories]);


  const loadMore = useCallback(async (parentId: number | null) => {
    const key = getKey(parentId);
    const state = categoryData[key] ?? defaultCategoryState;
    if (state.loading || state.loadingMore || !state.hasMore) return;
    await fetchCategories(parentId, state.page, true);
  }, [categoryData, fetchCategories]);

  const refresh = useCallback(async (parentId: number | null) => {
    await fetchCategories(parentId, 1, false);
  }, [fetchCategories]);

  const handleSetParentId = useCallback((id: number | null, name?: string) => {
    setBreadcrumbs(currentBreadcrumbs => {
      const newBreadcrumbs = [...currentBreadcrumbs];
      const existingIndex = newBreadcrumbs.findIndex(b => b.id === id);

      if (id === null) {
        return [{ id: null, name: 'Home' }];
      } else if (existingIndex !== -1) {
        return newBreadcrumbs.slice(0, existingIndex + 1);
      } else if (name) {
        return [...newBreadcrumbs, { id, name }];
      }
      return newBreadcrumbs;
    });

    setActiveParentId(id);
  }, []);

  const getCategoryState = useCallback((parentId: number | null) => {
    const key = getKey(parentId);
    return categoryData[key] ?? defaultCategoryState;
  }, [categoryData]);

  return (
    <CategoryContext.Provider
      value={{
        getCategoryState,
        loadMore,
        refresh,
        setParentId: handleSetParentId,
        breadcrumbs,
      }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = (parentId: number | null) => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }

  const state = context.getCategoryState(parentId);

  return {
    ...state,
    loadMore: () => context.loadMore(parentId),
    refresh: () => context.refresh(parentId),
    setParentId: context.setParentId,
    breadcrumbs: context.breadcrumbs,
  };
};

export default CategoryProvider;