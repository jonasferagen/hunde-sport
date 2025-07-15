import { PageSectionHorizontal } from '@/components/layout/PageSectionHorizontal';
import { CustomText, Loader } from '@/components/ui';
import { useProducts } from '@/hooks/Product';
import { VerticalStack } from '../../layout';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
    productIds: number[];
}

export const RelatedProducts = ({ productIds }: RelatedProductsProps) => {
    const { products: relatedProducts, isLoading } = useProducts(productIds);

    if (isLoading) {
        return <Loader />;
    }

    if (!relatedProducts || relatedProducts.length === 0) {
        return null;
    }

    return (
        <VerticalStack spacing="md">
            <CustomText bold>Relaterte Produkter</CustomText>
            <PageSectionHorizontal>
                {relatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </PageSectionHorizontal>
        </VerticalStack>
    );
};
