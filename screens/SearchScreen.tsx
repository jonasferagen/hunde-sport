import { ProductList } from '@/components/features/product/ProductList';
import { PageBody, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { SearchBar, ThemedXStack } from '@/components/ui';
import { DefaultTextContent } from '@/components/ui/DefaultTextContent';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { useSearchContext } from '@/contexts/SearchContext';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SizableText } from 'tamagui';
import { LoadingScreen } from './misc/LoadingScreen';


export const SearchScreen = () => {
    useRenderGuard("SearchScreen")
    const { query: initialQuery } = useLocalSearchParams<{ query: string }>();
    const { query, queryResult } = useSearchContext();
    const { isLoading, total } = queryResult;

    const isSearching = isLoading && query;
    const searchQuery = query ? `Søkeresultater for "${query}"` : 'Søk etter produkter, merker og kategorier.';
    const searchTotal = isSearching ? <ThemedSpinner /> : `(${total})`;

    return (
        <PageView >
            <PageHeader>
                <SearchBar initialQuery={initialQuery} placeholder="Produktsøk" />
                <ThemedXStack container split>
                    <SizableText f={1}>
                        {searchQuery}
                    </SizableText>
                    <SizableText f={0}>
                        {searchTotal}
                    </SizableText>
                </ThemedXStack>
            </PageHeader>
            <PageBody>
                <PageSection f={1} p="none">
                    <SearchResults key={query} />
                </PageSection>
            </PageBody>
        </PageView>
    );
};


const SearchResults = () => {
    const { query, queryResult } = useSearchContext();

    const { items: products,
        isLoading,
        fetchNextPage,
        isFetchingNextPage
    } = queryResult;

    if (!query) {
        return <></>;
    }

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (products.length === 0) {
        return <DefaultTextContent>Ingen resultater funnet for "{query}"</DefaultTextContent>
    }

    return (
        <ProductList
            products={products}
            loadMore={fetchNextPage}
            loadingMore={isFetchingNextPage}
        />
    );
};