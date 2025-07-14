import { VerticalStack } from '@/components/layout';
import { Heading, Loader, ProductTile } from '@/components/ui';
import { useBreadcrumbs } from '@/hooks/Breadcrumb/BreadcrumbProvider';
import { useRelatedProducts } from '@/hooks/Product/Product';
import { SPACING } from '@/styles';
import { Product } from '@/types';
import { useMemo } from 'react';
import { ScrollView } from 'react-native';

interface RelatedProductsProps {
    productIds: number[];
}

export const RelatedProducts = ({ productIds }: RelatedProductsProps) => {
    const { setTrail, init } = useBreadcrumbs();
    const relatedProductQueries = useRelatedProducts(productIds);
    const relatedProducts = useMemo(() =>
        relatedProductQueries
            .map(query => query.data)
            .filter(Boolean) as Product[]
        , [relatedProductQueries]);

    const isLoading = useMemo(() =>
        relatedProductQueries.some(query => query.isLoading)
        , [relatedProductQueries]);

    if (!productIds || productIds.length === 0) {
        return null;
    }

    if (isLoading) {
        return <Loader />;
    }

    if (!relatedProducts.length) {
        return null;
    }

    return (
        <VerticalStack spacing="md">
            <Heading title="Relaterte Produkter" size="lg" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: SPACING.md }}>
                {relatedProducts.map((product) => (
                    <ProductTile key={product.id} product={product} width={200} height={150} onPress={() => setTrail(init().concat([{ id: product.id, name: product.name, type: 'product' }]), true)} />
                ))}
            </ScrollView>
        </VerticalStack>
    );
};
