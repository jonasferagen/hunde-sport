import { useCallback, useState } from 'react';

export function useItemCache<T>(
    fetcher: (id: number) => Promise<T>
) {
    const [cache, setCache] = useState<Record<number, T>>({});
    const [loading, setLoading] = useState<Record<number, boolean>>({});
    const [error, setError] = useState<Record<number, string | null>>({});

    const getItem = useCallback(async (id: number): Promise<T | null> => {
        if (cache[id]) return cache[id];
        if (loading[id]) return null;

        setLoading(prev => ({ ...prev, [id]: true }));
        setError(prev => ({ ...prev, [id]: null }));

        try {
            const item = await fetcher(id);
            setCache(prev => ({ ...prev, [id]: item }));
            return item;
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Unknown error';
            setError(prev => ({ ...prev, [id]: message }));
            return null;
        } finally {
            setLoading(prev => ({ ...prev, [id]: false }));
        }
    }, [cache, loading, fetcher]);

    return { getItem, cache, loading, error };
}

export default useItemCache;