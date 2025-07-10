

import { useProduct } from '@/context/Product/Product';
import FullScreenLoader from '../../ui/FullScreenLoader';
import ProductDetails from './ProductDetails';

export default function Product({ productId }: { productId: number }) {

    const { data, isLoading, error } = useProduct(productId);


    if (isLoading) {
        return <FullScreenLoader />;
    }


    return <ProductDetails product={data!} />;


}