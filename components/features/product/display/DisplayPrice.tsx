import { formatPrice } from '@/lib/helpers';
import { ProductPrices } from '@/models/Product/ProductPrices';
import React, { JSX } from 'react';
import { SizableText, SizableTextProps, XStack } from 'tamagui';

interface DisplayPriceProps {
    productPrices: ProductPrices;
    size?: string;
}

export const DisplayPrice = ({ productPrices, size = "$4" }: DisplayPriceProps & SizableTextProps): JSX.Element => {

    if (productPrices.regular_price !== productPrices.sale_price) {
        return <XStack ai="center" gap="$2">
            <SizableText textDecorationLine="line-through" opacity={0.7} fos={size}>
                {formatPrice(productPrices.regular_price)}
            </SizableText>
            <SizableText fow="bold" fos={size}>
                {formatPrice(productPrices.sale_price)}
            </SizableText>
        </XStack>
    }

    if (productPrices.price_range) {
        return <SizableText fow="bold" fos={size}>
            Fra {formatPrice(productPrices.price_range.min_amount)}
        </SizableText>
    }


    return <SizableText fow="bold" fos={size}>
        {formatPrice(productPrices.price)}
    </SizableText>
};
