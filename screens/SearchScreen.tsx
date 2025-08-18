// app/(app)/search.tsx (or component file it exports)
import { ProductList } from '@/components/features/product/list/ProductList';
import { PageBody, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ThemedXStack } from '@/components/ui';
import { DefaultTextContent } from '@/components/ui/DefaultTextContent';
import { SearchBar } from '@/components/ui/search-bar/SearchBar';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { useProductsBySearch } from '@/hooks/data/Product';
import { QueryResult } from '@/hooks/data/util';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useScreenReady } from '@/hooks/useScreenReady';
import { PurchasableProduct } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SizableText } from 'tamagui';


export const SearchScreen = () => {

    const ready = useScreenReady(0);

    return (
        <PageView>
            {ready ? <SearchScreenContents /> : null}
        </PageView>
    );
}


export const SearchScreenContents = () => {
    useRenderGuard('SearchScreen');
    const params = useLocalSearchParams<{ query?: string }>();
    const [query, setQuery] = React.useState(String(params.query ?? ''));

    const result = useProductsBySearch(query);
    const isSearching = result.isLoading && !!query;
    const title = query
        ? `Søkeresultater for "${query}"`
        : 'Søk etter produkter, merker og kategorier.';
    const total = isSearching ? <ThemedSpinner /> : `(${result.total ?? 0})`;

    return (
        <><PageHeader>
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
            </PageBody></>

    );
};

type SearchResultsProps = {
    query: string;
    result: QueryResult<PurchasableProduct>;
};

const SearchResults = React.memo(({ query, result }: SearchResultsProps) => {

    useRenderGuard('SearchResults');

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
