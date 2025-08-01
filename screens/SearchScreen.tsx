import { ProductList } from '@/components/features/product/ProductList';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { SearchBar } from '@/components/ui';
import { DefaultTextContent } from '@/components/ui/DefaultTextContent';
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
    const { query, liveQuery } = useSearchContext();
    const searchInputRef = useRunOnFocus<TextInput>((input) => input.focus());
    const isWaiting = query !== liveQuery;

    return (
        <PageView>
            <PageHeader zIndex={5} theme="tertiary_soft">
                <SearchBar initialQuery={initialQuery} ref={searchInputRef} placeholder="Produktsøk" />
                {isWaiting || query && <SizableText>
                    {isWaiting
                        ? `Leter etter "${liveQuery}"...`
                        : (query ? `Søkeresultater for "${query}"` : ' ')}
                </SizableText>}
            </PageHeader>
            <PageSection f={1}>
                <PageContent f={1} p="none" theme="secondary_soft">
                    <SearchResults />
                </PageContent>
            </PageSection>
        </PageView>
    );
};

const SearchResults = () => {
    const { query, liveQuery, products, isLoading, fetchNextPage, isFetchingNextPage } = useSearchContext();

    if (isLoading || liveQuery !== query) {
        return <LoadingScreen />;
    }

    if (!query) {
        return (
            <DefaultTextContent>Søk etter produkter, merker og kategorier.</DefaultTextContent>
        );
    }

    if (products.length === 0) {
        return (
            <DefaultTextContent>Ingen resultater funnet for "{query}"</DefaultTextContent>
        );
    }

    return (
        <ProductList
            products={products}
            loadMore={fetchNextPage}
            loadingMore={isFetchingNextPage}
        />
    );
};