import { useContext, useEffect } from 'react';
import ProductCategoryContext from './ProductCategoryContext';

export const useProductCategories = (productCategoryId: number) => {
    const context = useContext(ProductCategoryContext);
    if (!context) throw new Error('This hook must be used within a ProductCategoryProvider');

    const { getState, loadMore, refresh, getProductCategoryById, hydrateCache } = context;

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
        loadMore: () => loadMore(productCategoryId),
        refresh: () => refresh(productCategoryId),
        getProductCategoryById,
    };
};

export default useProductCategories;