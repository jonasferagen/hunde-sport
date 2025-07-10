
import { Category } from '@/types';
import { usePaginatorResource } from '@/utils/paginatorResource';
import { useContext, useEffect, useState } from 'react';
import { fetchCategoryByCategory } from './CategoryApi';
import CategoryContext from './CategoryContext';

export const useCategoriesByCategory = (categoryId: number) => {
    // Creates its own paginator instance, making the hook self-contained
    const { getState, loadMore, refresh } = usePaginatorResource<Category>(fetchCategoryByCategory);

    // Still uses the shared context for caching
    const categoryContext = useContext(CategoryContext);
    const { hydrateCache, getCategoryById } = categoryContext!;

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
        getCategoryById,
    };
};

export const useCategoryById = (id: number) => {
    const context = useContext(CategoryContext);
    const { getCategoryById } = context!;
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchCategoryData = async () => {
            setLoading(true);
            setError(null);
            try {
                const item = await getCategoryById(id);
                if (isMounted) {
                    setCategory(item);
                }
            } catch (e: any) {
                if (isMounted) {
                    setError(e.message || 'Failed to fetch category');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCategoryData();

        return () => {
            isMounted = false;
        };
    }, [id, getCategoryById]);

    return { category, loading, error };
};

export default useCategoriesByCategory;