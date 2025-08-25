// components/product/ProductPriceTag.tsx
import { Product, PurchasableProduct } from '@/types';
import { StarFull } from '@tamagui/lucide-icons';
import React from 'react';
import { XStack } from 'tamagui';
import { ProductPrice } from './ProductPrice';

export const ProductPriceTag = React.memo(function ProductPriceTag({
    product,
}: { product: Product }) {

    const { isOnSale, isFree } = product.availability;

    return (
        <XStack ai="center"  >
            {(isOnSale || isFree) ? <StarFull scale={0.5} color="gold" /> : null}
            <ProductPrice product={product as PurchasableProduct} />
        </XStack>
    );
});
