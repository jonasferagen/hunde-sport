import { Product } from '@/models/Product';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { SizableText, XStack } from 'tamagui';
interface VariantInfoProps {
    variant: Product;
}

export const VariantInfo = ({ variant }: VariantInfoProps) => {
    const isOutOfStock = variant.stock_status === 'outofstock';
    const textDecorationLine = isOutOfStock ? 'line-through' : 'none';
    return (
        <XStack alignItems="center" gap="$2">
            {isOutOfStock && (
                <XStack alignItems="center" gap="$1">
                    <SizableText fontWeight="bold" color='$red10' fontSize="$1">Utsolgt</SizableText>
                </XStack>
            )}
            <SizableText color='$color' textDecorationLine={textDecorationLine}>{formatPrice(variant.price)}</SizableText>
        </XStack>
    );
};
