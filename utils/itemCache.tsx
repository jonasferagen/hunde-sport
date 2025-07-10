import { useCallback, useState } from 'react';

export function ItemCache<T>(
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

    const hydrateCache = useCallback((items: T[]) => {
        setCache(prev => {
            const newCache = { ...prev };
            for (const item of items) {
                // Assume item has an id property; this assumes T has an id field or is compatible
                const itemId = (item as any).id;
                if (newCache[itemId]) {
                    continue;
                }
                if (itemId !== undefined && itemId !== null) {
                    newCache[itemId] = item;
                }
            }
            return newCache;
        });
    }, []);


    return { getItem, hydrateCache, cache, loading, error };
}

export default ItemCache;