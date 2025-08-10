import { usePurchasable } from '@/hooks/usePurchasable';
import { formatPrice, formatPriceRange } from '@/lib/helpers';
import React from 'react';
import { SizableText, SizableTextProps, XStack } from 'tamagui';

export const ProductPriceRange = ({ ...props }: SizableTextProps) => {

    const { activeProduct } = usePurchasable();
    const { price_range } = activeProduct.prices;

    if (!price_range) {
        return null;
    }

    return (
        <SizableText fow="bold" fos="$4" {...props}>
            {formatPriceRange(price_range)}
        </SizableText>
    );
};


export const ProductPrice = ({ ...props }: SizableTextProps) => {

    const { activeProduct } = usePurchasable();
    const { isInStock, isPurchasable, isOnSale } = activeProduct.availability;
    const { sale_price, price, regular_price, price_range } = activeProduct.prices;

    if (price_range) {
        return <ProductPriceRange {...props} />;
    }

    if (!isPurchasable || !isInStock) {
        return <SizableText
            color="$colorSubtle"
            textDecorationLine='line-through'
            fow="bold"
            fos="$4"
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
                    fos="$4"
                    {...props}>
                    {formatPrice(regular_price)}
                </SizableText>
                <SizableText fow="bold"
                    fos="$4"
                    {...props}>
                    {formatPrice(sale_price)}
                </SizableText>
            </XStack>
        );
    }

    return (
        <SizableText fow="bold" fos="$4" {...props}>
            {formatPrice(price)}
        </SizableText>
    );
};

