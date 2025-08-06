import { ProductList } from '@/components/features/product/ProductList';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { SearchBar } from '@/components/ui';
import { DefaultTextContent } from '@/components/ui/DefaultTextContent';
import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { useSearchContext } from '@/contexts/SearchContext';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { TextInput } from 'react-native';
import { SizableText } from 'tamagui';
import { LoadingScreen } from './misc/LoadingScreen';


export const SearchScreen = () => {
    useRenderGuard("SearchScreen")
    const { query: initialQuery } = useLocalSearchParams<{ query: string }>();
    const { query, liveQuery, queryResult } = useSearchContext();

    const searchInputRef = useRunOnFocus<TextInput>((input) => input.focus());
    const isWaiting = query !== liveQuery;
    const searchQueryText = isWaiting
        ? `Leter etter "${liveQuery}"...`
        : (query ? `Søkeresultater for "${query}"` : 'Søk etter produkter, merker og kategorier.');

    const { isLoading, total } = queryResult;

    return (
        <PageView>
            <PageHeader theme="tertiary">
                <SearchBar initialQuery={initialQuery} ref={searchInputRef} placeholder="Produktsøk" />
            </PageHeader>
            <PageSection>
                <PageContent theme="tertiary_soft" ai="center" jc="space-between" fd="row">
                    <SizableText f={1}>
                        {searchQueryText}
                    </SizableText>
                    <SizableText f={0}>
                        {isLoading || isWaiting ? <ThemedSpinner /> : query ? `(${total})` : ''}
                    </SizableText>
                </PageContent>
                <PageContent f={1} p="none" theme="tertiary_soft">
                    <SearchResults key={query} />
                </PageContent>
            </PageSection>
        </PageView>
    );
};


const SearchResults = () => {
    const { query, liveQuery, queryResult } = useSearchContext();

    const { items: products,
        isLoading,
        fetchNextPage,
        isFetchingNextPage
    } = queryResult;

    if (!query) {
        return <></>;
    }

    if (isLoading || liveQuery !== query) {
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