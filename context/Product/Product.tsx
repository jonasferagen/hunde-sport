import { Product } from '@/types';
import { useContext, useEffect } from 'react';
import ProductContext from './ProductContext';

export const useProductsByCategory = (categoryId: number) => {
    const context = useContext(ProductContext);
    if (!context) throw new Error('This hook must be used within a ProductContextProvider');

    const { getState, loadMore, refresh, getItem: getItem, hydrateCache } = context;

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
        getItem
    };
};

export const useProductById = (productId: number): Promise<Product | null> => {
    const context = useContext(ProductContext);
    if (!context) throw new Error('This hook must be used within a ProductContextProvider');

    const { getItem } = context;

    return getItem(productId);
};


export default useProductsByCategory;