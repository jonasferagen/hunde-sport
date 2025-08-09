import { Chip } from '@/components/ui/chips/Chip';
import { useProductContext } from '@/contexts';
import { formatPrice, formatPriceRange } from '@/lib/helpers';
import React, { JSX } from 'react';
import { SizableText, SizableTextProps, StackProps, XStack } from 'tamagui';

export const PriceRange = ({ ...props }: SizableTextProps) => {

    const { purchasable } = useProductContext();
    const { prices } = purchasable;
    const { price_range } = prices;

    if (!price_range) {
        return null;
    }

    return (
        <SizableText fow="bold" {...props}>
            {formatPriceRange(price_range)}
        </SizableText>
    );
};


export const Price = ({ ...props }: SizableTextProps) => {

    const { purchasable } = useProductContext();
    const { prices, availability } = purchasable;
    const { isInStock, isPurchasable, isOnSale } = availability;
    const { sale_price, price, regular_price, price_range } = prices;

    if (price_range) {
        return <PriceRange {...props} />;
    }

    if (!isInStock || !isPurchasable) {
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

interface PriceTagProps extends StackProps { }

export const PriceTag = ({ children, ...stackProps }: PriceTagProps): JSX.Element => {

    const { purchasable } = useProductContext();
    const { availability } = purchasable;
    const { isInStock, isPurchasable } = availability;

    return <Chip
        theme="success_alt10"
        disabled={!isInStock || !isPurchasable}
        {...stackProps}>
        <Price />
    </Chip>;
};
