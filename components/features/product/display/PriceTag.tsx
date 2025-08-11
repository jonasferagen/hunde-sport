import { ThemedLinearGradient } from '@/components/ui/themed-components/ThemedLinearGradient';
import { THEME_PRICE_TAG, THEME_PRICE_TAG_ON_SALE } from '@/config/app';
import { usePurchasableContext } from '@/contexts/PurchasableContext';
import { StarFull } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { SizableTextProps, StackProps, XStack } from 'tamagui';
import { ProductPrice } from './ProductPrice';

interface PriceTagProps extends StackProps { textProps?: SizableTextProps; }

export const PriceTag = ({ textProps, br = "$3", ...stackProps }: PriceTagProps): JSX.Element => {

    const { purchasable } = usePurchasableContext();
    const { isInStock, isPurchasable, isOnSale } = purchasable.availability;

    const theme = isOnSale ? THEME_PRICE_TAG_ON_SALE : THEME_PRICE_TAG;

    return <XStack
        ai="center"
        jc="center"
        p="$1"
        px="$3"
        gap="$1"
        br={br}
        bw="$borderWidth"
        theme={theme}
        disabled={!isInStock || !isPurchasable}
        {...stackProps}>
        <ThemedLinearGradient br={br} {...stackProps} />
        {isOnSale && <StarFull size="$3" />}
        <ProductPrice {...textProps} />
    </XStack>;
};
