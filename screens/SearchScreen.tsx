import { ProductList } from '@/components/features/product/ProductList';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { CustomText, SearchBar } from '@/components/ui';
import { Loader } from '@/components/ui/loader/Loader';
import { useSearchProducts } from '@/hooks/Product';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { TextInput, View } from 'react-native';

export const SearchScreen = () => {
    const { query } = useLocalSearchParams<{ query: string }>();
    const { products, isLoading, fetchNextPage, isFetchingNextPage } = useSearchProducts(query);
    const searchInputRef = useRef<TextInput>(null);

    useFocusEffect(
        useCallback(() => {
            searchInputRef.current?.focus();
        }, [])
    );

    return (
        <PageView>
            <PageSection >
                <PageContent primary >
                    <SearchBar ref={searchInputRef} initialQuery={query} />
                    {query ? (
                        <CustomText size="md">{`Søkeresultater for "${query}"`}</CustomText>
                    ) : null}
                </PageContent>
            </PageSection>
            <PageSection flex>
                <PageContent flex paddingHorizontal="none" paddingVertical="none">
                    {isLoading && <Loader />}
                    {!isLoading && products.length === 0 && query && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <CustomText>Ingen resultater funnet for "{query}"</CustomText>
                        </View>
                    )}
                    <ProductList
                        products={products}
                        loadMore={fetchNextPage}
                        loadingMore={isFetchingNextPage}
                    />
                </PageContent>
            </PageSection>
        </PageView>
    );
};
