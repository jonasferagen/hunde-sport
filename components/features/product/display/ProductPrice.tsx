import { usePurchasable } from '@/hooks/usePurchasable';
import { formatPrice, formatPriceRange } from '@/lib/helpers';
import { PurchasableProduct } from '@/types';
import React from 'react';
import { SizableTextProps, XStack } from 'tamagui';
import { PriceText } from './PriceText';

export const ProductPriceRange = ({ ...props }: SizableTextProps) => {

    const { activeProduct } = usePurchasable();
    const { price_range } = activeProduct.prices;

    if (!price_range) {
        return null;
    }

    return (
        <PriceText {...props}>
            {formatPriceRange(price_range)}
        </PriceText>
    );
};



export const ProductPrice = ({ ...props }: SizableTextProps) => {
    const { activeProduct } = usePurchasable();
    return <ProductPriceImpl product={activeProduct as PurchasableProduct} {...props} />;
};

export const BaseProductPrice = ({ ...props }: SizableTextProps) => {
    const { product } = usePurchasable();
    return <ProductPriceImpl product={product as PurchasableProduct} {...props} />;
}


const ProductPriceImpl = ({ product, ...props }: { product: PurchasableProduct } & SizableTextProps) => {
    const { isInStock, isPurchasable, isOnSale } = product.availability;
    const { sale_price, price, regular_price, price_range } = product.prices;

    if (price_range) {
        return <ProductPriceRange {...props} />;
    }

    if (!isPurchasable || !isInStock) {
        return <PriceText
            variant="disabled"
            {...props}>
            {formatPrice(price)}
        </PriceText>
    }

    if (isOnSale) {
        return (
            <XStack ai="center" gap="$2">
                <PriceText
                    variant="disabled"
                    {...props}>
                    {formatPrice(regular_price)}
                </PriceText>
                <PriceText
                    {...props}>
                    {formatPrice(sale_price)}
                </PriceText>
            </XStack>
        );
    }

    return (
        <PriceText {...props}>
            {formatPrice(price)}
        </PriceText>
    );
};