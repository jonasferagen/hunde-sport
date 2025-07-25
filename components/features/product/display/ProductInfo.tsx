import { Product, ProductVariation } from '@/types';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { SizableText, XStack } from 'tamagui';
interface ProductInfoProps {
    product: Product | ProductVariation;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
    const isOutOfStock = product.stock_status === 'outofstock';
    const textDecorationLine = isOutOfStock ? 'line-through' : 'none';
    return (
        <XStack alignItems="center" gap="$2">
            {isOutOfStock && (
                <XStack alignItems="center" gap="$1">
                    <SizableText fontWeight="bold" color='$red10' fontSize="$1">Utsolgt</SizableText>
                </XStack>
            )}
            <SizableText color='$color' textDecorationLine={textDecorationLine}>{formatPrice(product.price)}</SizableText>
        </XStack>
    );
};
