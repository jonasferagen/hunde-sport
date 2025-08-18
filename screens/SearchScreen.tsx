// SearchScreen.tsx
import { ProductList } from '@/components/features/product/list/ProductList';
import { PageBody, PageHeader, PageSection, PageView } from '@/components/layout';
import { ThemedXStack } from '@/components/ui';
import { DefaultTextContent } from '@/components/ui/DefaultTextContent';
import { SearchBar } from '@/components/ui/search-bar/SearchBar';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { useProductsBySearch } from '@/hooks/data/Product';
import { useDebouncedValue } from '@/hooks/useDebouncedValue'; // simple 200–300ms debounce hook
import { useScreenReady } from '@/hooks/useScreenReady';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SizableText } from 'tamagui';

export const SearchScreen = () => {
    const ready = useScreenReady(0); // start work after interactions
    const params = useLocalSearchParams<{ query?: string }>();
    const [query, setQuery] = React.useState(String(params.query ?? ''));
    const debounced = useDebouncedValue(query, 250);

    // Gate query work behind `ready` and non-empty search
    const result = useProductsBySearch(debounced, {
        enabled: ready && debounced.length > 0,
    });

    const isSearching = result.isLoading && !!debounced;
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
                    {/* Show nothing (or a subtle placeholder) until ready */}
                    {!ready ? (
                        <DefaultTextContent><ThemedSpinner /></DefaultTextContent>
                    ) : !debounced ? null : result.isLoading ? (
                        <DefaultTextContent><ThemedSpinner /></DefaultTextContent>
                    ) : !result.items?.length ? (
                        <DefaultTextContent>Ingen resultater funnet for "{debounced}"</DefaultTextContent>
                    ) : (
                        <ProductList
                            products={result.items}
                            loadMore={result.fetchNextPage}
                            loadingMore={result.isFetchingNextPage}
                        />
                    )}
                </PageSection>
            </PageBody>
        </PageView>
    );
};
