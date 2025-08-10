import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { THEME_PRICE_TAG, THEME_PRICE_TAG_ON_SALE } from '@/config/app';
import { Product } from '@/types';
import { StarFull } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { SizableTextProps, StackProps, XStack } from 'tamagui';
import { ProductPrice } from './ProductPrice';

interface PriceTagProps extends StackProps { product: Product; textProps?: SizableTextProps; }

export const PriceTag = ({ product, textProps, ...stackProps }: PriceTagProps): JSX.Element => {


    const { isInStock, isPurchasable, isOnSale } = product.availability;

    const theme = isOnSale ? THEME_PRICE_TAG_ON_SALE : THEME_PRICE_TAG;

    return <XStack
        ai="center"
        jc="center"
        p="$2"
        gap="$1"
        br="$3"
        bw="$borderWidth"
        theme={theme}
        disabled={!isInStock || !isPurchasable}
        {...stackProps}>
        <ThemedLinearGradient {...stackProps} />
        {isOnSale && <StarFull size="$3" />}
        <ProductPrice product={product} {...textProps} />
    </XStack>;
};
