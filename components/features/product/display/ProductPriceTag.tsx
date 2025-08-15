import { ThemedXStack } from '@/components/ui';
import { THEME_PRICE_TAG, THEME_PRICE_TAG_SALE } from '@/config/app';
import { usePurchasableContext } from '@/contexts/PurchasableContext';
import { StarFull } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { SizableTextProps, StackProps } from 'tamagui';
import { ProductPrice } from './ProductPrice';

interface ProductPriceTagProps extends StackProps { textProps?: SizableTextProps; }

export const ProductPriceTag = ({ textProps, br = "$3", ...stackProps }: ProductPriceTagProps): JSX.Element => {

    const { purchasable } = usePurchasableContext();
    const { isInStock, isPurchasable, isOnSale } = purchasable.availability;

    const theme = isOnSale ? THEME_PRICE_TAG_SALE : THEME_PRICE_TAG;

    return <ThemedXStack
        theme={theme}
        ai="center"
        jc="center"
        p="$1"
        px="$2"
        gap="$1"
        br={br}
        bg="$background"
        disabled={!isInStock || !isPurchasable}
        {...stackProps}>

        {isOnSale && <StarFull scale={.5} color="gold" />}
        <ProductPrice {...textProps} />
    </ThemedXStack>;
};
