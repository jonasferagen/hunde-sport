// app/contexts/CategoryContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ENDPOINTS } from '../../config/api';
import type { Breadcrumb, Category } from '../../types';
import apiClient from '../../utils/apiClient';

const mapToCategory = (item: any): Category => ({
  id: item.id,
  name: item.name,
  parent: item.parent,
  image: item.image,
});

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
  setParentId: (id: number | null, name?: string) => void;
  breadcrumbs: Breadcrumb[];
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [parentId, setParentIdState] = useState<number | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([{ id: null, name: 'Home' }]);

  useEffect(() => {
    // Reset and fetch new categories when parentId changes
    setCategories([]);
    setPage(1);
    setHasMore(true);
    fetchCategories(1, false);
  }, [parentId]);

  const fetchCategories = async (pageNum: number, append = false) => {
    if (!hasMore && append) return;
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.CATEGORIES.LIST(pageNum, parentId || 0)
      );

      if (error) {
        throw new Error(error);
      }
      
      if (!data) {
        setHasMore(false);
        return [];
      }

      const mappedData = data.map(mapToCategory);
      const filteredData = mappedData; //mappedData.filter(category => category.image && category.image.src);

      if (filteredData.length === 0) {
        setHasMore(false);
      } else {
        setCategories(prev => append ? [...prev, ...filteredData] : filteredData);
        setPage(pageNum + 1);
      }
      
      setError(null);
      return filteredData;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching categories:', err);
      return [];
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = async () => {
    if (loading || loadingMore || !hasMore) return;
    await fetchCategories(page, true);
  };

  const refresh = async () => {
    setHasMore(true);
    setPage(1);
    await fetchCategories(1, false);
  };

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
      return newBreadcrumbs; // Return original if no changes
    });

    setParentIdState(id);
  }, []); // No dependencies, so the function is created only once

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        loadingMore,
        error,
        loadMore,
        refresh,
        setParentId: handleSetParentId,
        breadcrumbs,
      }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

export default CategoryProvider;