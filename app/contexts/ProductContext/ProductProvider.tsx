import React, {
    createContext, useCallback, useContext, useEffect, useState
} from 'react';
import type { Product } from '../../../types';
import { fetchProductDetail, fetchProductList } from './productApi';
import type { ProductContextType, ProductState } from './productTypes';
import { getKey } from './productUtils';

const defaultProductState: ProductState = {
    products: [],
    loading: false,
    loadingMore: false,
    error: null,
    page: 1,
    hasMore: true,
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [productData, setProductData] = useState<Record<string, ProductState>>({});
    const [productDetailCache, setProductDetailCache] = useState<Record<string, Product>>({});
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

    const fetchProducts = useCallback(async (categoryId: number | null, pageNum: number, append = false) => {
        if (categoryId === null) return;

        const key = getKey(categoryId);
        const currentState = productData[key] ?? defaultProductState;

        if (!currentState.hasMore && append) return;

        setProductData(prev => ({
            ...prev,
            [key]: { ...currentState, loading: pageNum === 1, loadingMore: pageNum > 1, error: null },
        }));

        try {
            const products = await fetchProductList(categoryId, pageNum);

            setProductData(prev => {
                const state = prev[key] ?? defaultProductState;
                const newProducts = append ? [...state.products, ...products] : products;
                return {
                    ...prev,
                    [key]: {
                        ...state,
                        products: newProducts,
                        page: pageNum + 1,
                        hasMore: products.length > 0,
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
    }, [activeCategoryId]);

    const getProductById = useCallback(async (productId: number): Promise<Product | null> => {
        for (const key in productData) {
            const found = productData[key].products.find(p => p.id === productId);
            if (found) return found;
        }

        if (productDetailCache[productId]) return productDetailCache[productId];

        try {
            const product = await fetchProductDetail(productId);
            setProductDetailCache(prev => ({ ...prev, [productId]: product }));
            return product;
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
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = (categoryId: number | null) => {
    const context = useContext(ProductContext);
    if (!context) {
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
