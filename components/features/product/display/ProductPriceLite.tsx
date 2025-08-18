// components/product/ProductPriceLite.tsx
import { ThemedText } from '@/components/ui/themed-components';
import { formatMinorWithHeader, formatRangeWithHeader, ProductPrices } from '@/domain/pricing';
import type { PurchasableProduct } from '@/types';
import React from 'react';
import { SizableTextProps, XStack } from 'tamagui';

export const ProductPriceLite = React.memo(function ProductPriceLite({
    product,
    ...props
}: { product: PurchasableProduct } & SizableTextProps) {
    const { on_sale, is_in_stock, is_purchasable } = product;
    const prices = product.prices as ProductPrices;

    // Variable products: show range
    if (prices.price_range) {
        return (
            <ThemedText {...props}>
                {formatRangeWithHeader(prices.price_range, prices, { style: 'short' })}
            </ThemedText>
        );
    }

    const unit = on_sale ? prices.sale_price : prices.price;
    const unitFormatted = formatMinorWithHeader(unit, prices, { style: 'short' });
    const regularFormatted = formatMinorWithHeader(prices.regular_price, prices, { style: 'short' });

    if (!is_purchasable || !is_in_stock) {
        return <ThemedText disabled {...props}>{unitFormatted}</ThemedText>;
    }

    if (on_sale) {
        return (
            <XStack ai="center" gap="$2">
                <ThemedText disabled {...props}>{regularFormatted}</ThemedText>
                <ThemedText bold {...props}>{unitFormatted}</ThemedText>
            </XStack>
        );
    }

    return <ThemedText {...props}>{unitFormatted}</ThemedText>;
}, (a, b) => {
    // prevent re-renders unless display-relevant fields change
    const ap = a.product, bp = b.product;
    return ap.id === bp.id &&
        ap.on_sale === bp.on_sale &&
        ap.is_in_stock === bp.is_in_stock &&
        ap.is_purchasable === bp.is_purchasable &&
        eqPrices(ap.prices, bp.prices);
});

function eqPrices(a: ProductPrices, b: ProductPrices) {
    // compare just fields that affect display
    return a.price === b.price &&
        a.sale_price === b.sale_price &&
        a.regular_price === b.regular_price &&
        a.currency_code === b.currency_code &&
        (!!a.price_range === !!b.price_range); // coarse guard for range
}
