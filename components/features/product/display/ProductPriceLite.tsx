// components/features/product/display/ProductPriceLite.tsx
import { ThemedText } from '@/components/ui/themed-components';
import type { PurchasableProduct } from '@/types';
import React from 'react';
import { SizableTextProps, XStack } from 'tamagui';

export const ProductPriceLite = React.memo(function ProductPriceLite({
    product,
    ...props
}: { product: PurchasableProduct } & SizableTextProps) {




    if (product.hasPriceRange) {
        return <ThemedText {...props}>{product.displayPrice}</ThemedText>;
    }

    if (!product.is_purchasable || !product.is_in_stock) {
        return <ThemedText disabled {...props}>{product.displayPrice}</ThemedText>;
    }

    if (product.on_sale) {
        return (
            <XStack ai="center" gap="$2">
                {product.displayRegularPrice ? (
                    <ThemedText disabled {...props}>{product.displayRegularPrice}</ThemedText>
                ) : null}
                <ThemedText bold {...props}>{product.displayPrice}</ThemedText>
            </XStack>
        );
    }

    return <ThemedText {...props}>{product.displayPrice}</ThemedText>;
}, (a, b) =>
    a.product.id === b.product.id &&
    a.product.priceKey === b.product.priceKey &&
    a.product.availabilityKey === b.product.availabilityKey
);
