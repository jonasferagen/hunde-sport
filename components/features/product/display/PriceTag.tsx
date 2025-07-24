import { Loader } from '@/components/ui/loader/Loader';
import { useProductContext } from '@/contexts';
import { useProductVariants } from '@/hooks/useProductVariants';
import { formatPrice, formatPriceRange } from '@/utils/helpers';
import React from 'react';
import { FontSizeTokens, SizableText, XStack } from 'tamagui';

interface PriceInfoProps {
    fontSize?: FontSizeTokens;
}

export const PriceTag = ({ fontSize = '$3' }: PriceInfoProps) => {
    const { product } = useProductContext();
    const { isLoading, priceRange } = useProductVariants(product);

    if (isLoading) {
        return (
            <Loader size="small" flex />
        );
    }

    if (priceRange) {
        return (
            <SizableText fontWeight="bold" fontSize={fontSize}>
                {formatPriceRange(priceRange)}
            </SizableText>
        );
    }


    if (product.on_sale) {
        return (
            <XStack alignItems="center">
                <SizableText textDecorationLine="line-through" mr="$2" opacity={0.7} fontSize={fontSize}>
                    {formatPrice(product.regular_price)}
                </SizableText>
                <SizableText fontWeight="bold" fontSize={fontSize}>
                    {formatPrice(product.sale_price)}
                </SizableText>
            </XStack>
        );
    }

    return (
        <SizableText fontWeight="bold" fontSize={fontSize}>
            {formatPrice(product.price)}
        </SizableText>
    );
};
