// app/(app)/search.tsx (or component file it exports)
import { ProductList } from '@/components/features/product/list/ProductList';
import { PageBody, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ThemedXStack } from '@/components/ui';
import { DefaultTextContent } from '@/components/ui/DefaultTextContent';
import { SearchBar } from '@/components/ui/search-bar/SearchBar';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { useProductsBySearch } from '@/hooks/data/Product';
import { PurchasableProduct } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SizableText } from 'tamagui';

const toSig = (obj: Record<string, any>) =>
    JSON.stringify(Object.fromEntries(
        Object.entries(obj).flatMap(([k, v]) => {
            if (v == null) return [];
            const s = String(Array.isArray(v) ? v[0] : v).trim();
            return s ? [[k, s]] : [];
        })
    ));

export const SearchScreen = () => {
    const params = useLocalSearchParams<{ query?: string }>();
    const [query, setQuery] = React.useState(String(params.query ?? ''));

    // debounce + guard URL writes (so Drawer doesn’t churn)
    React.useEffect(() => {
        const tid = setTimeout(() => {
            const next = query.trim();
            const current = String(params.query ?? '');
            if (next !== current) router.setParams(next ? { query: next } : {});
        }, 200);
        return () => clearTimeout(tid);
    }, [query, params.query]);


    const result = useProductsBySearch(query);

    const isSearching = result.isLoading && !!query;
    const title = query
        ? `Søkeresultater for "${query}"`
        : 'Søk etter produkter, merker og kategorier.';
    const total = isSearching ? <ThemedSpinner /> : `(${result.total ?? 0})`;

    return (
        <PageView>
            <PageHeader>
                <SearchBar
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Produktsøk"
                />
                <ThemedXStack container split>
                    <SizableText f={1}>{title}</SizableText>
                    <SizableText f={0}>{total}</SizableText>
                </ThemedXStack>
            </PageHeader>

            <PageBody>
                <PageSection f={1} p="none">
                    <SearchResults query={query} result={result} />
                </PageSection>
            </PageBody>
        </PageView>
    );
};

type SearchResultsProps = {
    query: string;
    result: {
        items: PurchasableProduct[];
        isLoading: boolean;
        fetchNextPage: () => void;
        isFetchingNextPage: boolean;
    };
};

const SearchResults = React.memo(({ query, result }: SearchResultsProps) => {
    const { items, isLoading, fetchNextPage, isFetchingNextPage } = result;

    if (!query) return null;
    if (isLoading) return <DefaultTextContent><ThemedSpinner /></DefaultTextContent>;
    if (!items?.length)
        return <DefaultTextContent>Ingen resultater funnet for "{query}"</DefaultTextContent>;

    return (
        <ProductList
            products={items}
            loadMore={fetchNextPage}
            loadingMore={isFetchingNextPage}
        />
    );
});
