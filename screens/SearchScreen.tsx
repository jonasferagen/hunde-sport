import { ProductList } from '@/components/features/product/ProductList';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { CustomText, SearchBar } from '@/components/ui';
import { Loader } from '@/components/ui/loader/Loader';
import { useSearchProducts } from '@/hooks/Product';
import { useDebounce } from '@/hooks/useDebounce';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';

export const SearchScreen = () => {
    const { query: initialQuery } = useLocalSearchParams<{ query: string }>();
    const [liveQuery, setLiveQuery] = useState(initialQuery || '');
    const debouncedQuery = useDebounce(liveQuery, 1000);

    const { products, isLoading, fetchNextPage, isFetchingNextPage } = useSearchProducts(initialQuery);
    const searchInputRef = useRunOnFocus<TextInput>((input) => input.focus());

    // This effect handles the debounced search.
    // It runs only when the user stops typing for a moment.
    useEffect(() => {
        // We only want to trigger a search if the debounced query is not empty
        // and is different from the query already in the URL.
        if (debouncedQuery && debouncedQuery !== initialQuery) {
            router.setParams({ query: debouncedQuery });
        }
    }, [debouncedQuery]);

    // This effect handles the immediate clearing of the search.
    // It runs instantly when the user clears the text input.
    useEffect(() => {
        if (liveQuery === '' && initialQuery !== '') {
            router.setParams({ query: '' });
        }
    }, [liveQuery]);

    // This function handles the explicit search (e.g., pressing the search button)
    const handleSearch = (currentQuery: string) => {
        // Update the param immediately, bypassing the debounce
        router.setParams({ query: currentQuery });
    };

    return (
        <PageView>
            <PageSection >
                <PageContent primary >
                    <SearchBar
                        ref={searchInputRef}
                        initialQuery={initialQuery}
                        onQueryChange={setLiveQuery}
                        onSubmit={handleSearch}
                    />
                    {initialQuery ? (
                        <CustomText size="md">{`Søkeresultater for "${initialQuery}"`}</CustomText>
                    ) : null}
                </PageContent>
            </PageSection>
            <PageSection flex>
                {initialQuery && <PageContent flex paddingHorizontal="none" paddingVertical="none">
                    {isLoading && <Loader />}
                    {!isLoading && products.length === 0 && initialQuery && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <CustomText>Ingen resultater funnet for "{initialQuery}"</CustomText>
                        </View>
                    )}
                    <ProductList
                        products={products}
                        loadMore={fetchNextPage}
                        loadingMore={isFetchingNextPage}
                    />
                </PageContent>
                }
            </PageSection>
        </PageView>
    );
};