import { ProductList } from '@/components/features/product/ProductList';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { SearchBar } from '@/components/ui';
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
        <PageView theme="tertiary">
            <PageHeader>
                <SearchBar initialQuery={initialQuery} placeholder="Produktsøk" />
            </PageHeader>
            <PageSection>
                <PageContent theme="soft" ai="center" jc="space-between" fd="row">
                    <SizableText f={1}>
                        {searchQuery}
                    </SizableText>
                    <SizableText f={0}>
                        {searchTotal}
                    </SizableText>
                </PageContent>
                <PageContent f={1} p="none" theme="elevated">
                    <SearchResults key={query} />
                </PageContent>
            </PageSection>
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