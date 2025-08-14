
import { usePurchasableContext } from '@/contexts';
import { formatPrice, formatPriceRange } from '@/lib/helpers';
import { PurchasableProduct } from '@/types';
import React from 'react';
import { SizableTextProps, XStack } from 'tamagui';

import { ThemedText } from '@/components/ui/themed-components/';

export const ProductPriceRange = ({ ...props }: SizableTextProps) => {

    const { purchasable } = usePurchasableContext();
    const { activeProduct } = purchasable;
    const { price_range } = activeProduct.prices;

    if (!price_range) {
        return null;
    }

    return (
        <ThemedText {...props}>
            {formatPriceRange(price_range)}
        </ThemedText>
    );
};

export const ProductPrice = ({ ...props }: SizableTextProps) => {
    const { purchasable } = usePurchasableContext();
    const { activeProduct } = purchasable;
    return <ProductPriceImpl product={activeProduct as PurchasableProduct} {...props} />;
};

export const BaseProductPrice = ({ ...props }: SizableTextProps) => {
    const { purchasable } = usePurchasableContext();
    const { product } = purchasable;
    return <ProductPriceImpl product={product} {...props} />;
}


const ProductPriceImpl = ({ product, ...props }: { product: PurchasableProduct } & SizableTextProps) => {
    const { isInStock, isPurchasable, isOnSale } = product.availability;
    const { sale_price, price, regular_price, price_range } = product.prices;

    if (price_range) {
        return <ProductPriceRange {...props} />;
    }

    if (!isPurchasable || !isInStock) {
        return <ThemedText
            disabled
            {...props}>
            {formatPrice(price)}
        </ThemedText>
    }

    if (isOnSale) {
        return (
            <XStack ai="center" gap="$2">
                <ThemedText
                    {...props}>
                    {formatPrice(regular_price)}
                </ThemedText>
                <ThemedText
                    {...props}>
                    {formatPrice(sale_price)}
                </ThemedText>
            </XStack>
        );
    }

    return (
        <ThemedText {...props}>
            {formatPrice(price)}
        </ThemedText>
    );
};