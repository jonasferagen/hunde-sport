import { CustomText } from '@/components/ui';
import { Loader } from '@/components/ui/loader/Loader';
import { useRelatedProducts } from '@/hooks/Product/Product';
import { SPACING } from '@/styles';
import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { VerticalStack } from '../../layout';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
    productIds: number[];
}

export const RelatedProducts = ({ productIds }: RelatedProductsProps) => {
    const relatedProductQueries = useRelatedProducts(productIds);
    const relatedProducts = useMemo(() =>
        relatedProductQueries
            .map(query => query.data)
            .filter(product => product !== undefined),
        [relatedProductQueries]
    );

    if (relatedProductQueries.some(query => query.isLoading)) {
        return <Loader />;
    }

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <VerticalStack spacing="md">
            <CustomText bold size="lg">Relaterte Produkter</CustomText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: SPACING.md }}>
                {relatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </ScrollView>
        </VerticalStack>
    );
};
