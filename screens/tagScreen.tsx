import ProductList from '@/components/features/product/ProductList';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { Heading } from '@/components/ui';
import Loader from '@/components/ui/Loader';
import { useProductsByTag } from '@/hooks/Product/Product';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function TagScreen() {
    const { id, name } = useLocalSearchParams<{ id: string, name: string }>();
    const tagId = parseInt(id || '0', 10);
    const { data, isLoading, fetchNextPage, isFetchingNextPage } = useProductsByTag(tagId);

    if (isLoading) {
        return <Loader />;
    }

    const products = data?.pages.flat() ?? [];

    return (
        <PageView>
            <PageContent>
                <PageSection>
                    <View style={{ flex: 1 }}>
                        <Heading title={`Produkter merket med "${name}"`} size="lg" />
                        <ProductList
                            products={products}
                            loadMore={fetchNextPage}
                            loadingMore={isFetchingNextPage}
                            EmptyComponent={
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>{`Ingen produkter merket med "${name}" funnet`}</Text>
                                </View>
                            }
                        />
                    </View>
                </PageSection>
            </PageContent>
        </PageView>
    );
}
