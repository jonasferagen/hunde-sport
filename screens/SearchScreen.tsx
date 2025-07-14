import { ProductList } from '@/components/features/product/ProductList';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Heading, SearchBar } from '@/components/ui';
import { Loader } from '@/components/ui/Loader';
import { useSearchProducts } from '@/hooks/Product/Product';
import { useState } from 'react';
import { Text, View } from 'react-native';

export const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const { products, isLoading, fetchNextPage, isFetchingNextPage } = useSearchProducts(query);

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
    };


    return (
        <PageView>
            <PageContent>
                <PageSection>
                    <SearchBar onSearch={handleSearch} />
                </PageSection>
                <PageSection primary>
                    <Heading title={`Søkeresultater for "${query}"`} size="lg" />
                </PageSection>
            </PageContent>
            <PageContent flex>
                <PageSection flex>
                    {isLoading && <Loader />}

                    {query ? (
                        <ProductList
                            products={products}
                            loadMore={fetchNextPage}
                            loadingMore={isFetchingNextPage}
                            EmptyComponent={
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>Ingen produkter funnet.</Text>
                                </View>
                            }
                        />
                    ) : (
                        <Text>koko.</Text>
                    )}
                </PageSection>
            </PageContent >
        </PageView >
    );
}
