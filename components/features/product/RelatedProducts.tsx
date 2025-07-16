
import { Loader } from '@/components/ui';
import { useProducts } from '@/hooks/Product';
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
        relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))

    );
};
