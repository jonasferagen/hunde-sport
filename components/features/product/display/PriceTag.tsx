import { useProductContext } from '@/contexts';
import { useProductVariants } from '@/hooks/useProductVariants';
import { formatPrice, formatPriceRange } from '@/utils/helpers';
import React, { JSX } from 'react';
import { FontSizeTokens, SizableText, Spinner, XStack } from 'tamagui';

interface PriceProps {
    product: any;
    fontSize: FontSizeTokens;
}

const Price = ({ product, fontSize }: PriceProps) => {
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

interface PriceTagProps {
    fontSize?: FontSizeTokens;
}

export const PriceTag = ({ fontSize = "$3" }: PriceTagProps): JSX.Element => {
    const { product } = useProductContext();
    const { isLoading, priceRange } = useProductVariants(product);

    if (isLoading) {
        return <Spinner alignSelf='flex-end' size="small" />;
    }

    if (priceRange) {
        return (
            <SizableText fontWeight="bold" fontSize={fontSize}>
                {formatPriceRange(priceRange)}
            </SizableText>
        );
    }

    return <Price product={product} fontSize={fontSize} />;
};
