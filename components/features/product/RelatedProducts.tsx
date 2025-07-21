
import { Loader } from '@/components/ui';
import { useRelatedProducts } from '@/hooks/Product';
import { ProductTile } from './ProductTile';

interface RelatedProductsProps {
    productIds: number[];
}

export const RelatedProducts = ({ productIds }: RelatedProductsProps) => {
    const { products: relatedProducts, isLoading } = useRelatedProducts(productIds);

    if (isLoading) {
        return <Loader />;
    }

    if (!relatedProducts || relatedProducts.length === 0) {
        return null;
    }

    return (
        relatedProducts.map((product) => (
            <ProductTile key={product.id} product={product} />
        ))

    );
};
