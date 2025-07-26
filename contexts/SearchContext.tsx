import { useProductsBySearch } from '@/hooks/data/Product';
import { useDebounce } from '@/hooks/useDebounce';
import { Product } from '@/models/Product';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface SearchContextType {
    query: string;
    liveQuery: string;
    products: Product[];
    isLoading: boolean;
    isFetchingNextPage: boolean;
    setLiveQuery: (query: string) => void;
    setQuery: (query: string) => void;
    fetchNextPage: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [liveQuery, setLiveQuery] = useState('');
    const [query, setQuery] = useState('');
    const debouncedLiveQuery = useDebounce(liveQuery, 500);

    useEffect(() => {
        setQuery(debouncedLiveQuery);
    }, [debouncedLiveQuery]);

    const {
        items: products,
        isLoading,
        fetchNextPage,
        isFetchingNextPage
    } = useProductsBySearch(query);

    const value = useMemo(() => ({
        query,
        liveQuery,
        products,
        isLoading,
        isFetchingNextPage,
        setLiveQuery,
        setQuery,
        fetchNextPage,
    }), [query, liveQuery, products, isLoading, isFetchingNextPage, fetchNextPage]);

    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
};
