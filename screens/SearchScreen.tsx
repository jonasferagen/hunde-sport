import { ProductList } from '@/components/features/product/ProductList';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { CustomText, Loader, SearchBar } from '@/components/ui';
import { useSearchProducts } from '@/hooks/Product';
import { useRunOnFocus } from '@/hooks/useRunOnFocus';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';

export const SearchScreen = () => {
    const { query: initialQuery } = useLocalSearchParams<{ query: string }>();
    const [liveQuery, setLiveQuery] = useState(initialQuery || '');

    const { products, isLoading, fetchNextPage, isFetchingNextPage } = useSearchProducts(initialQuery);
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

    console.log("productsearch rendered", initialQuery, products.length, isLoading, isFetchingNextPage);

    return (
        <PageView>
            <PageHeader title='Produktsøk'>

                <SearchBar
                    ref={searchInputRef}
                    initialQuery={initialQuery}
                    onTextChange={setLiveQuery}
                    onQueryChange={handleQueryChange}
                    onSubmit={handleSearchSubmit}
                    debounce={1000}
                />
                <CustomText fontSize="md">
                    {isWaiting
                        ? `Leter etter "${liveQuery}"...`
                        : (initialQuery ? `Søkeresultater for "${initialQuery}"` : ' ')}
                </CustomText>

            </PageHeader>
            <PageSection flex>
                <PageContent flex padding="none" >

                    {isLoading ? (
                        <Loader size="large" flex />
                    ) : (
                        products.length === 0 && initialQuery ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <CustomText>Ingen resultater funnet for "{initialQuery}"</CustomText>
                            </View>
                        ) : (
                            <ProductList
                                products={products}
                                loadMore={fetchNextPage}
                                loadingMore={isFetchingNextPage}
                            />
                        )
                    )}

                </PageContent>
            </PageSection>
        </PageView>
    );
};