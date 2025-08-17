import { createContext, useContext, useMemo, useState } from "react";

// SearchProvider.tsx
interface SearchContextType {
    query: string;
    setQuery: (q: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [query, setQuery] = useState('');
    // setter from useState is stable; memo only on `query`
    const value = useMemo(() => ({ query, setQuery }), [query]);
    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearchContext = () => {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error('useSearchContext must be used within a SearchProvider');
    return ctx;
};

