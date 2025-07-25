import { Product, ProductVariation } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { FontSizeTokens, SizableText, XStack } from 'tamagui';
export interface PriceProps {
    fontSize: FontSizeTokens;
    activeProduct: Product | ProductVariation;
}

export const Price = ({ fontSize = "$3", activeProduct }: PriceProps) => {

    if (activeProduct.on_sale) {
        return (
            <XStack ai="center">
                <SizableText textDecorationLine="line-through" mr="$2" opacity={0.7} fontSize={fontSize}>
                    {formatPrice(activeProduct.regular_price)}
                </SizableText>
                <SizableText fontWeight="bold" fontSize={fontSize}>
                    {formatPrice(activeProduct.sale_price)}
                </SizableText>
            </XStack>
        );
    }

    return (
        <SizableText fontWeight="bold" fontSize={fontSize}>
            {formatPrice(activeProduct.price)}
        </SizableText>
    );
};