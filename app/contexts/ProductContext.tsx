import React, { createContext, useContext, useEffect, useState } from 'react';
import { ENDPOINTS } from '../../config/api';
import type { Product } from '../../types';
import apiClient from '../../utils/apiClient';

const mapToProduct = (item: Product): Product => ({ ...item });

type ProductContextType = {
  products: Product[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  categoryId: number | null;
  product: Product | null;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setCategoryId: (id: number | null) => void;
  getProductById: (id: number) => Promise<Product | null>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
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
        const mappedProducts = data.map(mapToProduct);
        setProducts(prev => append ? [...prev, ...mappedProducts] : mappedProducts);
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

  const getProductById = async (id: number): Promise<Product | null> => {
    const existingProduct = products.find(p => p.id === id);
    if (existingProduct) {
      setProduct(existingProduct);
      return existingProduct;
    }

    try {
      setLoading(true);
      const { data, error } = await apiClient.get<Product>(`${ENDPOINTS.PRODUCTS.LIST(1)}/${id}`);
      
      if (error) {
        throw new Error(error);
      }

      if (data) {
        const mappedProduct = mapToProduct(data);
        setProducts(prev => [...prev, mappedProduct]);
        setProduct(mappedProduct);
        return mappedProduct;
      }
      
      setProduct(null);
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching product:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider 
      value={{
        products,
        loading,
        loadingMore,
        error,
        hasMore,
        categoryId,
        product,
        loadMore,
        refresh,
        setCategoryId,
        getProductById,
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
