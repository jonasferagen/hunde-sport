import { useCallback, useState } from 'react';

export interface PaginatedState<T> {
    items: T[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}

const defaultState: PaginatedState<any> = {
    items: [],
    loading: false,
    loadingMore: false,
    error: null,
    page: 1,
    hasMore: true,
};

export function usePaginatedResource<T>(
    fetcher: (id: number, page: number) => Promise<T[]>,
    getKey: (id: number) => string
) {
    const [data, setData] = useState<Record<string, PaginatedState<T>>>({});

    const fetchPage = useCallback(async (id: number, page: number, append = false) => {
        const key = getKey(id);
        const current = data[key] ?? defaultState;

        if (!current.hasMore && append) return;

        setData(prev => ({
            ...prev,
            [key]: { ...current, loading: page === 1, loadingMore: page > 1, error: null },
        }));

        try {
            const result = await fetcher(id, page);

            setData(prev => {
                const existing = prev[key] ?? defaultState;
                const newItems = append ? [...existing.items, ...result] : result;
                return {
                    ...prev,
                    [key]: {
                        ...existing,
                        items: newItems,
                        page: page + 1,
                        hasMore: result.length > 0,
                        loading: false,
                        loadingMore: false,
                        error: null,
                    },
                };
            });
        } catch (e) {
            setData(prev => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    loading: false,
                    loadingMore: false,
                    error: e instanceof Error ? e.message : 'Unknown error',
                },
            }));
        }
    }, [data, fetcher, getKey]);

    const getState = useCallback((id: number) => {
        return data[getKey(id)] ?? defaultState;
    }, [data, getKey]);

    const loadMore = useCallback((id: number) => {
        const state = getState(id);
        if (state.loading || state.loadingMore || !state.hasMore) return;
        fetchPage(id, state.page, true);
    }, [getState, fetchPage]);

    const refresh = useCallback((id: number) => {
        fetchPage(id, 1, false);
    }, [fetchPage]);

    return { getState, loadMore, refresh };
}

export default usePaginatedResource;