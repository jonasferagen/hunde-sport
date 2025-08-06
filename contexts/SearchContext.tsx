import { useProductsBySearch } from '@/hooks/data/Product';
import { QueryResult } from '@/hooks/data/util';
import { useDebounce } from '@/hooks/useDebounce';
import { Product } from '@/types';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface SearchContextType {
    query: string;
    liveQuery: string;
    queryResult: QueryResult<Product>;
    setLiveQuery: (query: string) => void;
    setQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [liveQuery, setLiveQuery] = useState('');
    const [query, setQuery] = useState('');
    const debouncedLiveQuery = useDebounce(liveQuery, 1000);

    useEffect(() => {
        setQuery(debouncedLiveQuery);
    }, [debouncedLiveQuery]);

    const queryResult = useProductsBySearch(query);

    const isLoading = queryResult.isLoading;
    const total = queryResult.total;

    const totalResults = isLoading ? total : undefined;


    const value = useMemo(() => ({
        query,
        liveQuery,
        setLiveQuery,
        setQuery,
        queryResult,
        totalResults,
    }), [query, liveQuery, queryResult]);

    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
};
