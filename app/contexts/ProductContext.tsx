import React, { createContext, useContext, useEffect, useState } from 'react';
import { ENDPOINTS } from '../../config/api';
import apiClient from '../../utils/apiClient';
import { Product } from '../types';

type ProductContextType = {
  products: Product[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  categoryId: number | null;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setCategoryId: (id: number | null) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const fetchProducts = async (pageNum: number, append = false) => {
    if (!categoryId) return [];
    
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const { data, error } = await apiClient.get<Product[]>(
        ENDPOINTS.PRODUCTS.LIST(pageNum, categoryId)
      );

      if (error) {
        throw new Error(error);
      }
      
      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => append ? [...prev, ...data] : data);
        setPage(pageNum + 1);
      }
      
      setError(null);
      return data || [];
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching products:', err);
      return [];
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = async () => {
    if (loading || loadingMore || !hasMore) return;
    await fetchProducts(page, true);
  };

  const refresh = async () => {
    setHasMore(true);
    setPage(1);
    await fetchProducts(1, false);
  };

  // Reset and fetch products when categoryId changes
  useEffect(() => {
    if (!categoryId) {
      setProducts([]);
      return;
    }
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchProducts(1, false);
  }, [categoryId]);

  return (
    <ProductContext.Provider 
      value={{
        products,
        loading,
        loadingMore,
        error,
        hasMore,
        categoryId,
        loadMore,
        refresh,
        setCategoryId,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductProvider;
