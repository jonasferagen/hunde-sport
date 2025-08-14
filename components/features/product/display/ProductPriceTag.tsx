import { ThemedLinearGradient } from '@/components/ui/themed-components/ThemedLinearGradient';
import { usePurchasableContext } from '@/contexts/PurchasableContext';
import { StarFull } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { SizableTextProps, StackProps, XStack } from 'tamagui';
import { ProductPrice } from './ProductPrice';

interface ProductPriceTagProps extends StackProps { textProps?: SizableTextProps; }

export const ProductPriceTag = ({ textProps, br = "$3", ...stackProps }: ProductPriceTagProps): JSX.Element => {

    const { purchasable } = usePurchasableContext();
    const { isInStock, isPurchasable, isOnSale } = purchasable.availability;


    return <XStack

        ai="center"
        jc="center"
        p="$1"
        px="$3"
        gap="$1"
        br={br}
        disabled={!isInStock || !isPurchasable}
        {...stackProps}>
        <ThemedLinearGradient br={br} {...stackProps} />
        {isOnSale && <StarFull />}
        <ProductPrice {...textProps} />
    </XStack>;
};
