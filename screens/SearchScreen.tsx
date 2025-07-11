import ProductList from '@/components/features/product/ProductList';
import { Heading, PageContent, PageSection, PageView } from '@/components/ui';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { useSearchProducts } from '@/context/Product/Product';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Button, Text, View } from 'react-native';

export default function SearchScreen() {
    const { q: query } = useLocalSearchParams<{ q: string }>();
    const { data, isLoading, fetchNextPage, isFetchingNextPage } = useSearchProducts(query || '');

    const products = useMemo(() => data?.pages.flat() ?? [], [data]);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <PageView>
            <PageContent>
                <PageSection>
                    <Button title="Back" onPress={() => router.back()} />
                    <Heading title={`Søkeresultater for "${query}"`} size="lg" />

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

                </PageSection>
            </PageContent>
        </PageView>
    );
}
