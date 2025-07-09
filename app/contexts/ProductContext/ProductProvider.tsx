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
    const [activeproductId, setActiveproductId] = useState<number>(0);

    const fetchProducts = useCallback(async (productId: number, pageNum: number, append = false) => {

        const key = getKey(productId);
        const currentState = productData[key] ?? defaultProductState;

        if (!currentState.hasMore && append) return;

        setProductData(prev => ({
            ...prev,
            [key]: { ...currentState, loading: pageNum === 1, loadingMore: pageNum > 1, error: null },
        }));

        try {
            const products = await fetchProductList(productId, pageNum);

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
        if (activeproductId === null) return;
        const key = getKey(activeproductId);
        if (!productData[key]) {
            fetchProducts(activeproductId, 1, false);
        }
    }, [activeproductId]);

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

    const loadMore = useCallback(async (productId: number) => {
        const key = getKey(productId);
        const state = productData[key] ?? defaultProductState;
        if (state.loading || state.loadingMore || !state.hasMore) return;
        await fetchProducts(productId, state.page, true);
    }, [productData, fetchProducts]);

    const refresh = useCallback(async (productId: number) => {
        await fetchProducts(productId, 1, false);
    }, [fetchProducts]);

    const getProductState = useCallback((productId: number) => {
        const key = getKey(productId);
        return productData[key] ?? defaultProductState;
    }, [productData]);

    return (
        <ProductContext.Provider
            value={{
                getProductState,
                getProductById,
                loadMore,
                refresh,
                setActiveproductId,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = (productId: number) => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }

    const state = context.getProductState(productId);

    return {
        ...state,
        loadMore: () => context.loadMore(productId),
        refresh: () => context.refresh(productId),
        setActiveproductId: context.setActiveproductId,
        getProductById: context.getProductById,
    };
};

export default ProductProvider;