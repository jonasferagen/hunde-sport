import { useProductsBySearch } from '@/hooks/data/Product';
import { QueryResult } from '@/hooks/data/util';
import { Product } from '@/types';
import React, { createContext, useContext, useMemo, useState } from 'react';

interface SearchContextType {
    query: string;
    queryResult: QueryResult<Product>;
    setQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [query, setQuery] = useState('');

    const queryResult = useProductsBySearch(query);

    const value = useMemo(() => ({
        query,
        setQuery,
        queryResult,

    }), [query, queryResult]);

    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
};
