import ProductList from '@/components/features/product/ProductList';
import { Heading, PageView } from '@/components/ui';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { useSearchProducts } from '@/context/Product/Product';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function SearchScreen() {
    const { q: query } = useLocalSearchParams<{ q: string }>();
    const { data, isLoading, fetchNextPage, isFetchingNextPage } = useSearchProducts(query || '');

    if (isLoading) {
        return <FullScreenLoader />;
    }

    const products = data?.pages.flat() ?? [];

    return (
        <PageView>
            <ProductList
                products={products}
                loadMore={fetchNextPage}
                loadingMore={isFetchingNextPage}
                HeaderComponent={<Heading title={`Søkeresultater for "${query}"`} size="lg" />}
                EmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Ingen produkter funnet.</Text>
                    </View>
                }
            />
        </PageView>
    );
}
