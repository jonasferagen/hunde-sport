import { ThemedXStack } from '@/components/ui';
import { THEME_PRICE_TAG } from '@/config/app';
import { Product, PurchasableProduct } from '@/types';
import { StarFull } from '@tamagui/lucide-icons';
import React from 'react';
import { SizableTextProps, StackProps } from 'tamagui';
import { ProductPrice } from './ProductPrice';

interface ProductPriceTagProps extends StackProps {
    product: Product,
    textProps?: SizableTextProps
}

export const ProductPriceTag = React.memo(function ProductPriceTag({ product, br, ...props }: ProductPriceTagProps) {


    const { availability } = product;
    const { isInStock, isPurchasable, isOnSale, isFree } = availability;
    const theme = THEME_PRICE_TAG //isOnSale ? THEME_PRICE_TAG_SALE : isFree ? THEME_PRICE_TAG_FREE : THEME_PRICE_TAG;

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
            {(isOnSale || isFree) && <StarFull scale={0.5} color="gold" />}
            <ProductPrice product={product as PurchasableProduct} />

        </ThemedXStack>
    );
});
