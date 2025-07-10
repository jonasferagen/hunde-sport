

import { useProductById } from '@/context/Product/Product';
import FullScreenLoader from './FullScreenLoader';
import RetryView from './RetryView';
import ProductDetails from './product/ProductDetails';

export default function Product({ productId }: { productId: number }) {

    const { product, loading, error } = useProductById(productId);

    if (loading) {
        return <FullScreenLoader />;
    }

    if (error) {
        return <RetryView error={error} onRetry={() => { }} />;
    }

    return <ProductDetails product={product!} />;


}