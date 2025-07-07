// app/contexts/CategoryContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ENDPOINTS } from '../../config/api';
import apiClient from '../../utils/apiClient';

type Category = {
  id: number;
  name: string;
};

type CategoryContextType = {
  categories: Category[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCategories = async (pageNum: number, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const { data, error } = await apiClient.get<Category[]>(ENDPOINTS.CATEGORIES.LIST(pageNum, 20));

      if (error) {
        throw new Error(error);
      }
      
      if (!data) {
        setHasMore(false);
        return [];
      }
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setCategories(prev => append ? [...prev, ...data] : data);
        setPage(pageNum + 1);
      }
      
      setError(null);
      return data;
      
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

  useEffect(() => {
    fetchCategories(1, false);
  }, []);

  return (
    <CategoryContext.Provider 
      value={{ 
        categories, 
        loading, 
        loadingMore,
        error, 
        hasMore,
        loadMore,
        refresh 
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

// Add this hook at the bottom of the file
export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

export default CategoryProvider;