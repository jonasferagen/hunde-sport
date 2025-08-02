import { useProductContext } from '@/contexts';
import { ProductVariation } from '@/models/Product/ProductVariation';
import { SimpleProduct } from '@/models/Product/SimpleProduct';

import { formatPrice } from '@/utils/helpers';
import { FontSizeTokens, SizableText, XStack } from 'tamagui';
export interface PriceProps {
    fontSize: FontSizeTokens;
    productOverride?: SimpleProduct | ProductVariation;
}

export const Price = ({ fontSize = "$3", productOverride }: PriceProps) => {

    const { product, productVariation } = useProductContext();

    const activeProduct = productOverride || productVariation || product;

    if (activeProduct.on_sale) {
        return (
            <XStack ai="center">
                <SizableText textDecorationLine="line-through" mr="$2" opacity={0.7} fontSize={fontSize}>
                    {formatPrice(activeProduct.prices.regular_price)}
                </SizableText>
                <SizableText fontWeight="bold" fontSize={fontSize}>
                    {formatPrice(activeProduct.prices.sale_price)}
                </SizableText>
            </XStack>
        );
    }

    return (
        <SizableText fontWeight="bold" fontSize={fontSize}>
            {formatPrice(activeProduct.prices.price)}
        </SizableText>
    );
};