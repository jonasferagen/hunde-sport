import { ProductList } from '@/components/features/product/ProductList';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Heading } from '@/components/ui';
import { Loader } from '@/components/ui/Loader';
import { useSearchProducts } from '@/hooks/Product/Product';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export const SearchScreen = () => {
    const { q: query } = useLocalSearchParams<{ q: string }>();
    const { products, isLoading, fetchNextPage, isFetchingNextPage } = useSearchProducts(query || '');


    if (isLoading) {
        return <Loader />;
    }

    return (
        <PageView>
            <PageContent>
                <PageSection primary>
                    <Heading title={`Søkeresultater for "${query}"`} size="lg" />
                </PageSection>
                <PageSection style={{ flex: 1 }}>
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
