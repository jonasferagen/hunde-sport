import { Chip } from '@/components/ui/chips/Chip';
import { THEME_PRICE_TAG, THEME_PRICE_TAG_ON_SALE } from '@/config/app';
import { useProductContext } from '@/contexts';
import { StarFull } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { StackProps } from 'tamagui';
import { ProductPrice } from './ProductPrice';

interface PriceTagProps extends StackProps { }

export const PriceTag = ({ children, ...stackProps }: PriceTagProps): JSX.Element => {

    const { purchasable } = useProductContext();
    const { availability } = purchasable;
    const { isInStock, isPurchasable, isOnSale } = availability;

    const theme = isOnSale ? THEME_PRICE_TAG_ON_SALE : THEME_PRICE_TAG;

    return <Chip
        bw={0}
        theme={theme}
        disabled={!isInStock || !isPurchasable}
        icon={isOnSale && <StarFull size="$3" />}
        {...stackProps}>
        <ProductPrice />
    </Chip>;
};
