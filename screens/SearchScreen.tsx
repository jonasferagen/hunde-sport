import { ProductList } from '@/components/features/product/ProductList';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { SearchBar } from '@/components/ui';
import { useProductsBySearch } from '@/hooks/data/Product';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { SizableText, Spinner, YStack } from 'tamagui';

export const SearchScreen = () => {
    const { query: initialQuery } = useLocalSearchParams<{ query: string }>();
    const [liveQuery, setLiveQuery] = useState(initialQuery || '');
    const searchInputRef = useRunOnFocus<TextInput>((input) => input.focus());

    useEffect(() => {
        if (initialQuery !== undefined) {
            setLiveQuery(initialQuery);

        }
    }, [initialQuery]);

    const handleQueryChange = (newQuery: string) => {
        if (newQuery !== initialQuery) {
            router.setParams({ query: newQuery });
        }
    };

    const handleSearchSubmit = (submittedQuery: string) => {
        router.setParams({ query: submittedQuery });
    };

    const isWaiting = initialQuery !== liveQuery;


    return (
        <PageView>
            <PageHeader>

                <SearchBar
                    ref={searchInputRef}
                    initialQuery={initialQuery}
                    onTextChange={setLiveQuery}
                    onQueryChange={handleQueryChange}
                    onSubmit={handleSearchSubmit}
                    debounce={1000}
                />
                <SizableText >
                    {isWaiting
                        ? `Leter etter "${liveQuery}"...`
                        : (initialQuery ? `Søkeresultater for "${initialQuery}"` : ' ')}
                </SizableText>

            </PageHeader>
            <PageSection style={{ flex: 1 }}>
                <PageContent style={{ flex: 1 }} paddingHorizontal="none" paddingVertical="none" >
                    {initialQuery && <SearchResults query={initialQuery} />}
                </PageContent>
            </PageSection>
        </PageView>
    );
};


const SearchResults = ({ query }: { query: string }) => {
    const { items: products, isLoading, fetchNextPage, isFetchingNextPage } = useProductsBySearch(query);
    return (
        isLoading ? (
            <YStack flex={1} ai="center" jc="center"><Spinner size="large" /></YStack>
        ) : (
            products.length === 0 && query ? (
                <YStack flex={1} ai="center" jc="center">
                    <SizableText>Ingen resultater funnet for "{query}"</SizableText>
                </YStack>
            ) : (
                <ProductList
                    products={products}
                    loadMore={fetchNextPage}
                    loadingMore={isFetchingNextPage}
                />
            )
        )
    );
};