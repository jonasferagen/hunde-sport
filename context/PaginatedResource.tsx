import { useCallback, useState } from 'react';

export interface PaginatedState<T> {
    items: T[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}
/*
const _defaultState: PaginatedState<any> = {
    items: [],
    loading: false,
    loadingMore: false,
    error: null,
    page: 1,
    hasMore: true,
};
*/
export function PaginatedResource<T>(
    fetcher: (id: number, page: number) => Promise<T[]>
) {
    const [data, setData] = useState<Record<string, PaginatedState<T>>>({});

    const defaultState: PaginatedState<T> = {
        items: [],
        loading: false,
        loadingMore: false,
        error: null,
        page: 1,
        hasMore: true,
    };

    const refresh = useCallback(async (id: number) => {
        const key = String(id);
        setData(prev => ({ ...prev, [key]: { ...defaultState, loading: true } }));

        try {
            const newItems = await fetcher(id, 1);
            setData(prev => ({
                ...prev,
                [key]: {
                    ...defaultState,
                    items: newItems,
                    hasMore: newItems.length > 0,
                },
            }));
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Unknown error';
            setData(prev => ({ ...prev, [key]: { ...defaultState, error: message } }));
        }
    }, [fetcher]);

    const loadMore = useCallback(async (id: number) => {
        const key = String(id);
        const currentState = data[key] ?? defaultState;

        if (currentState.loading || currentState.loadingMore || !currentState.hasMore) return;

        setData(prev => ({ ...prev, [key]: { ...currentState, loadingMore: true } }));

        try {
            const nextPage = currentState.page + 1;
            const newItems = await fetcher(id, nextPage);

            setData(prev => ({
                ...prev,
                [key]: {
                    ...currentState,
                    items: [...currentState.items, ...newItems],
                    page: nextPage,
                    hasMore: newItems.length > 0,
                    loadingMore: false,
                },
            }));
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Unknown error';
            setData(prev => ({ ...prev, [key]: { ...currentState, error: message, loadingMore: false } }));
        }
    }, [data, fetcher]);

    const getState = useCallback((id: number) => {
        const key = String(id);
        return data[key] ?? defaultState;
    }, [data]);

    return { getState, loadMore, refresh };
}

export default PaginatedResource;