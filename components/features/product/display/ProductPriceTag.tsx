import { ThemedXStack } from '@/components/ui';
import { THEME_PRICE_TAG, THEME_PRICE_TAG_SALE } from '@/config/app';
import { PurchasableProduct } from '@/types';
import { StarFull } from '@tamagui/lucide-icons';
import React from 'react';
import { SizableTextProps, StackProps } from 'tamagui';
import { ProductPriceLite } from './ProductPriceLite';

interface ProductPriceTagProps extends StackProps {
    product: PurchasableProduct,
    textProps?: SizableTextProps
}

export const ProductPriceTag = React.memo(function ProductPriceTag({ product, br, ...props }: ProductPriceTagProps) {


    const { availability } = product;
    const { isInStock, isPurchasable, isOnSale } = availability;
    const theme = isOnSale ? THEME_PRICE_TAG_SALE : THEME_PRICE_TAG;

    return (
        <ThemedXStack
            theme={theme}
            ai="center"
            jc="center"
            p="$1"
            px="$2"
            gap="$1"
            br="$5"

            bg="$background"
            disabled={!isInStock || !isPurchasable}
            {...props}
        >
            {isOnSale && <StarFull scale={0.5} color="gold" />}
            <ProductPriceLite product={product} />

        </ThemedXStack>
    );
});
