import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ENDPOINTS } from '../../config/api';
import type { Product } from '../../types';
import apiClient from '../../utils/apiClient';

// Represents the state for a list of products for one category
interface ProductState {
  products: Product[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

// The shape of the data provided by the context
interface ProductContextType {
  getProductState: (categoryId: number | null) => ProductState;
  getProductById: (productId: number) => Promise<Product | null>;
  loadMore: (categoryId: number | null) => void;
  refresh: (categoryId: number | null) => void;
  setActiveCategoryId: (id: number | null) => void;
}

const mapToProduct = (item: any): Product => ({
  id: item.id,
  name: item.name,
  description: item.description,
  short_description: item.short_description,
  categories: item.categories || [],
  images: item.images || [],
});

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const defaultProductState: ProductState = {
  products: [],
  loading: false,
  loadingMore: false,
  error: null,
  page: 1,
  hasMore: true,
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // A map from categoryId to the state for that product list
  const [productData, setProductData] = useState<Record<string, ProductState>>({});
  // A cache for individual product details
  const [productDetailCache, setProductDetailCache] = useState<Record<string, Product>>({});
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const getKey = (categoryId: number | null) => categoryId?.toString() ?? 'all';

  const fetchProducts = useCallback(async (categoryId: number | null, pageNum: number, append = false) => {
    if (categoryId === null) return; // Don't fetch if no category is selected
    const key = getKey(categoryId);
    const currentState = productData[key] ?? defaultProductState;

    if (!currentState.hasMore && append) return;

    setProductData(prev => ({
      ...prev,
      [key]: { ...currentState, loading: pageNum === 1, loadingMore: pageNum > 1, error: null },
    }));

    try {
      const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.LIST(pageNum, categoryId)
      );

      if (error) throw new Error(error);

      const mappedData = data?.map(mapToProduct) ?? [];

      setProductData(prev => {
        const state = prev[key];
        const newProducts = append ? [...state.products, ...mappedData] : mappedData;
        return {
          ...prev,
          [key]: {
            ...state,
            products: newProducts,
            page: pageNum + 1,
            hasMore: mappedData.length > 0,
            loading: false,
            loadingMore: false,
          },
        };
      });
    } catch (err) {
      setProductData(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          error: err instanceof Error ? err.message : 'An unknown error occurred',
          loading: false,
          loadingMore: false,
        },
      }));
    }
  }, [productData]);

  useEffect(() => {
    if (activeCategoryId === null) return;
    const key = getKey(activeCategoryId);
    if (!productData[key]) {
      fetchProducts(activeCategoryId, 1, false);
    }
  }, [activeCategoryId, productData, fetchProducts]);

  const getProductById = useCallback(async (productId: number): Promise<Product | null> => {
    // First, check if the product is in any of the loaded category lists
    for (const key in productData) {
      const foundProduct = productData[key].products.find(p => p.id === productId);
      if (foundProduct) {
        return foundProduct;
      }
    }

    // Second, check the dedicated cache for individually fetched products
    if (productDetailCache[productId]) {
      return productDetailCache[productId];
    }

    // Finally, if not found anywhere, fetch from the API
    try {
      const { data, error } = await apiClient.get<Product>(`${ENDPOINTS.PRODUCTS.GET(productId)}`);
      if (error) throw new Error(error);

      if (data) {
        const mappedProduct = mapToProduct(data);
        setProductDetailCache(prev => ({ ...prev, [productId]: mappedProduct }));
        return mappedProduct;
      }
      return null;
    } catch (err) {
      console.error('Error fetching product:', err);
      return null;
    }
  }, [productData, productDetailCache]);

  const loadMore = useCallback(async (categoryId: number | null) => {
    const key = getKey(categoryId);
    const state = productData[key] ?? defaultProductState;
    if (state.loading || state.loadingMore || !state.hasMore) return;
    await fetchProducts(categoryId, state.page, true);
  }, [productData, fetchProducts]);

  const refresh = useCallback(async (categoryId: number | null) => {
    await fetchProducts(categoryId, 1, false);
  }, [fetchProducts]);

  const getProductState = useCallback((categoryId: number | null) => {
    const key = getKey(categoryId);
    return productData[key] ?? defaultProductState;
  }, [productData]);

  return (
    <ProductContext.Provider
      value={{
        getProductState,
        getProductById,
        loadMore,
        refresh,
        setActiveCategoryId,
      }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (categoryId: number | null) => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }

  const state = context.getProductState(categoryId);

  return {
    ...state,
    loadMore: () => context.loadMore(categoryId),
    refresh: () => context.refresh(categoryId),
    setActiveCategoryId: context.setActiveCategoryId,
    getProductById: context.getProductById,
  };
};

export default ProductProvider;
