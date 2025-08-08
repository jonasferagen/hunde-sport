import { useProductContext } from '@/contexts';
import { formatPrice, formatPriceRange } from '@/lib/helpers';
import { ProductPriceRange, ProductPrices } from '@/models/Product/ProductPrices';
import React, { JSX } from 'react';
import { SizableText, SizableTextProps, XStack } from 'tamagui';



interface PriceRangeProps extends SizableTextProps {
    productPriceRange: ProductPriceRange
}

export const PriceRange = ({ productPriceRange, ...props }: PriceRangeProps & SizableTextProps) => {

    return (
        <SizableText fow="bold" {...props}>
            {formatPriceRange(productPriceRange)}
        </SizableText>
    );
};


interface PriceProps {
    prices: ProductPrices;
}

export const Price = ({ prices, ...props }: PriceProps & SizableTextProps) => {

    const { sale_price, price, regular_price, price_range } = prices;

    if (price_range) {
        return <PriceRange productPriceRange={price_range} {...props} />;
    }
    const onSale = sale_price !== price;

    if (onSale) {
        return <XStack ai="center" gap="$2">
            <SizableText textDecorationLine="line-through" opacity={0.7} {...props}>
                {formatPrice(regular_price)}
            </SizableText>
            <SizableText fow="bold" {...props}>
                {formatPrice(sale_price)}
            </SizableText>
        </XStack>
    }

    return (
        <SizableText fow="bold" {...props}>
            {formatPrice(price)}
        </SizableText>
    );
};



interface PriceTagProps extends SizableTextProps { }

export const PriceTag = ({ ...props }: PriceTagProps): JSX.Element => {
    const { purchasable } = useProductContext();
    const { product, productVariation } = purchasable;

    if (productVariation) {
        return <Price prices={productVariation.prices} {...props} />;
    }
    return <Price prices={product.prices} {...props} />;
};
