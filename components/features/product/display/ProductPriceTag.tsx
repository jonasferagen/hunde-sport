// components/product/ProductPriceTag.tsx
import { Product, PurchasableProduct } from '@/types';
import { StarFull } from '@tamagui/lucide-icons';
import React from 'react';
import { XStack } from 'tamagui';
import { ProductPrice } from './ProductPrice';
import { Loader } from '@/components/ui/Loader';
import { useProductPricing } from '@/domain/pricing';

export const ProductPriceTag = React.memo(function ProductPriceTag({
    product,
}: { product: Product }) {


    const { isOnSale } = product.availability;
    const { isFree, isLoading } = useProductPricing(product);

    return (
        <XStack ai="center">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    {(isOnSale || isFree) ? <StarFull scale={0.5} color="gold" /> : null}
                    <ProductPrice product={product as PurchasableProduct} />
                </>
            )}
        </XStack>
    );
});
