import { ProductList } from '@/components/features/product/ProductList';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { SearchBar } from '@/components/ui';
import { useSearchContext } from '@/contexts/SearchContext';
import { useRenderGuard } from '@/hooks/useRenderGuard';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { TextInput } from 'react-native';
import { SizableText, YStack } from 'tamagui';
import { LoadingScreen } from './misc/LoadingScreen';

export const SearchScreen = () => {
    useRenderGuard("SearchScreen")
    const { query: initialQuery } = useLocalSearchParams<{ query: string }>();
    const { query, liveQuery } = useSearchContext();
    const searchInputRef = useRunOnFocus<TextInput>((input) => input.focus());
    const isWaiting = query !== liveQuery;

    return (
        <PageView>
            <PageHeader zIndex={5} elevation={4} theme="secondary">
                <SearchBar initialQuery={initialQuery} ref={searchInputRef} placeholder="Produktsøk" />
                <SizableText fontSize="$3">
                    {isWaiting
                        ? `Leter etter "${liveQuery}"...`
                        : (query ? `Søkeresultater for "${query}"` : ' ')}
                </SizableText>
            </PageHeader>
            <PageSection flex={1}>
                <PageContent flex={1} paddingHorizontal="none" paddingVertical="none">
                    <SearchResults />
                </PageContent>
            </PageSection>
        </PageView>
    );
};

const SearchResults = () => {
    const { query, products, isLoading, fetchNextPage, isFetchingNextPage } = useSearchContext();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!query) {
        return (
            <YStack flex={1} ai="center" jc="center">
                <SizableText>Søk etter produkter, merker og kategorier.</SizableText>
            </YStack>
        );
    }

    if (products.length === 0) {
        return (
            <YStack flex={1} ai="center" jc="center">
                <SizableText>Ingen resultater funnet for "{query}"</SizableText>
            </YStack>
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