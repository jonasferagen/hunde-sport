import { Loader } from '@/components/ui/loader/Loader';
import { useProductContext } from '@/contexts';
import { useProductVariants } from '@/hooks/useProductVariants';
import { formatPrice } from '@/utils/helpers';
import React from 'react';
import { FontSizeTokens, Text, XStack } from 'tamagui';

interface PriceInfoProps {
    fontSize?: FontSizeTokens;
}

export const PriceTag = ({ fontSize = '$3' }: PriceInfoProps) => {
    const { product } = useProductContext();
    const { isLoading } = useProductVariants(product);

    if (!product) {
        return null;
    }

    if (isLoading) {
        return (
            <Loader size="small" flex />
        );
    }

    if (product.on_sale) {
        return (
            <XStack alignItems="center">
                <Text textDecorationLine="line-through" marginRight="$2" opacity={0.7} fontSize={fontSize}>
                    {formatPrice(product.regular_price)}
                </Text>
                <Text fontWeight="bold" fontSize={fontSize}>
                    {formatPrice(product.sale_price)}
                </Text>
            </XStack>
        );
    }

    return (
        <Text fontWeight="bold" fontSize={fontSize}>
            {formatPrice(product.price)}
        </Text>
    );
};
