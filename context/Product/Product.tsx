import { Product } from '@/types';
import { usePaginatorResource } from '@/utils/paginatorResource';
import { useContext, useEffect, useState } from 'react';
import { fetchProductByCategory } from './ProductApi';
import ProductContext from './ProductContext';

export const useProductsByCategory = (categoryId: number) => {
    // Creates its own paginator instance, making the hook self-contained
    const { getState, loadMore, refresh } = usePaginatorResource<Product>(fetchProductByCategory);

    const productContext = useContext(ProductContext);
    const { hydrateCache, getItem } = productContext!;

    // Fetch data when the component mounts or the ID changes
    useEffect(() => {
        refresh(categoryId);
    }, [categoryId, refresh]);

    const state = getState(categoryId);

    // Hydrate the item cache whenever the items for this category change
    useEffect(() => {
        if (state.items.length > 0) {
            hydrateCache(state.items);
        }
    }, [state.items, hydrateCache]);

    return {
        ...state,
        loadMore: () => loadMore(categoryId),
        refresh: () => refresh(categoryId),
        getItem, // Provide getItem for convenience
    };
};



export const useProductById = (productId: number) => {
    const context = useContext(ProductContext);
    const { getItem } = context!;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const item = await getItem(productId);
                if (isMounted) {
                    setProduct(item);
                }
            } catch (e: any) {
                if (isMounted) {
                    setError(e.message || 'Failed to fetch product');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProduct();

        return () => {
            isMounted = false;
        };
    }, [productId, getItem]);

    return { product, loading, error };
};