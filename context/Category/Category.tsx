import { useContext, useEffect } from 'react';
import CategoryContext from './CategoryContext';

export const useCategories = (categoryId: number) => {
    const context = useContext(CategoryContext);
    if (!context) throw new Error('This hook must be used within a CategoryProvider');

    const { getState, loadMore, refresh, getCategoryById: getProductCategoryById, hydrateCache } = context;

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
        getProductCategoryById,
    };
};

export default useCategories;