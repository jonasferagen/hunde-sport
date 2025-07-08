// app/contexts/CategoryContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ENDPOINTS } from '../../config/api';
import type { BaseContextType, Category } from '../../types';
import apiClient from '../../utils/apiClient';

type CategoryContextType = BaseContextType & {
  categories: Category[];
  parentId: number | null;
  setParentId: (id: number | null) => void;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [parentId, setParentId] = useState<number | null>(null);

  const fetchCategories = async (pageNum: number, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const { data, error } = await apiClient.get<Category[]>(
        ENDPOINTS.CATEGORIES.LIST(pageNum, parentId || 0)
      );
      const filteredData = data!.filter(category => category.image && category.image.src);


      if (error) {
        throw new Error(error);
      }
      
      if (!data) {
        setHasMore(false);
        return [];
      }
      
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

  // Reset and fetch categories when parentId changes
  useEffect(() => {
    setPage(1);
    setCategories([]);
    setHasMore(true);
    fetchCategories(1, false);
  }, [parentId]);

  return (
    <CategoryContext.Provider 
      value={{ 
        categories, 
        loading, 
        loadingMore,
        error, 
        hasMore,
        parentId,
        loadMore,
        refresh,
        setParentId
      }}
    >
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