import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { formatPrice, formatPriceRange } from '@/lib/helpers';
import React from 'react';
import { SizableText, SizableTextProps, XStack } from 'tamagui';

export const ProductPriceRange = ({ ...props }: SizableTextProps) => {

    const { product } = useBaseProductContext();
    const { price_range } = product.prices;

    if (!price_range) {
        return null;
    }

    return (
        <SizableText fow="bold" {...props}>
            {formatPriceRange(price_range)}
        </SizableText>
    );
};


export const ProductPrice = ({ ...props }: SizableTextProps) => {

    const { product } = useBaseProductContext();
    const { isInStock, isPurchasable, isOnSale } = product.availability;
    const { sale_price, price, regular_price, price_range } = product.prices;

    if (price_range) {
        return <ProductPriceRange {...props} />;
    }

    if (!isPurchasable || !isInStock) {
        return <SizableText
            color="$colorSubtle"
            textDecorationLine='line-through'
            fow="bold"
            {...props}>
            {formatPrice(price)}
        </SizableText>
    }

    if (isOnSale) {
        return (
            <XStack ai="center" gap="$2">
                <SizableText
                    textDecorationLine="line-through"
                    opacity={0.7}
                    {...props}>
                    {formatPrice(regular_price)}
                </SizableText>
                <SizableText fow="bold"
                    {...props}>
                    {formatPrice(sale_price)}
                </SizableText>
            </XStack>
        );
    }

    return (
        <SizableText fow="bold" {...props}>
            {formatPrice(price)}
        </SizableText>
    );
};

