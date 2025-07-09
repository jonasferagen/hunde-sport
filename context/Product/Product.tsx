import { useContext, useEffect } from 'react';
import ProductContext from './ProductContext';

export const useProductsByProductCategoryId = (productCategoryId: number) => {
    const context = useContext(ProductContext);
    if (!context) throw new Error('This hook must be used within a ProductContextProvider');

    const { getState, loadMore, refresh, getProductById, hydrateCache } = context;

    // Fetch data when the component mounts or the ID changes
    useEffect(() => {
        refresh(productCategoryId);
    }, [productCategoryId, refresh]);

    const state = getState(productCategoryId);

    // Hydrate the item cache whenever the items for this category change
    useEffect(() => {
        if (state.items.length > 0) {
            hydrateCache(state.items);
        }
    }, [state.items, hydrateCache]);

    return {
        ...state,
        loadMore: () => context.loadMore(productCategoryId),
        refresh: () => context.refresh(productCategoryId),
    };
};

export default useProductsByProductCategoryId;