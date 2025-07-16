import { ProductList } from '@/components/features/product/ProductList';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { CustomText, SearchBar } from '@/components/ui';
import { Loader } from '@/components/ui/loader/Loader';
import { useSearchProducts } from '@/hooks/Product';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

export const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const { products, isLoading, fetchNextPage, isFetchingNextPage } = useSearchProducts(query);
    const searchInputRef = useRef<TextInput>(null);

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
    };

    useFocusEffect(
        useCallback(() => {
            searchInputRef.current?.focus();
        }, [])
    );


    return (
        <PageView>
            <PageSection >
                <PageContent primary >
                    <SearchBar ref={searchInputRef} onSearch={handleSearch} />
                    {query && (
                        <CustomText size="md">{`Søkeresultater for "${query}"`}</CustomText>
                    )}
                </PageContent>
            </PageSection>
            <PageSection flex>
                <PageContent flex paddingHorizontal="none" paddingVertical="none">
                    {isLoading && <Loader />}
                    {query && !isLoading && (
                        <ProductList
                            products={products}
                            loadMore={fetchNextPage}
                            loadingMore={isFetchingNextPage}
                            EmptyComponent={
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <CustomText>Ingen produkter funnet.</CustomText>
                                </View>
                            }
                        />
                    )}
                </PageContent>
            </PageSection>
        </PageView >
    );
}
