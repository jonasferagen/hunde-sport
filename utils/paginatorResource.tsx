import { useCallback, useState } from 'react';

export interface PaginatorState<T> {
    items: T[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}

export interface PaginatorResourceActions<T> {
    getState: (id: number) => PaginatorState<T>;
    loadMore: (id: number) => Promise<void>;
    refresh: (id: number) => Promise<void>;
}

export function usePaginatorResource<T>(
    fetcher: (page: number, id: number) => Promise<T[]>
): PaginatorResourceActions<T> {
    const [data, setData] = useState<Record<string, PaginatorState<T>>>({});

    const defaultState: PaginatorState<T> = {
        items: [],
        loading: false,
        loadingMore: false,
        error: null,
        page: 1,
        hasMore: true,
    };

    const refresh = useCallback(async (id: number) => {
        const key = String(id);
        console.log('id', id);
        setData(prev => ({ ...prev, [key]: { ...defaultState, loading: true } }));


        try {
            const newItems = await fetcher(1, id);
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
            const newItems = await fetcher(nextPage, id);

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

export default usePaginatorResource;