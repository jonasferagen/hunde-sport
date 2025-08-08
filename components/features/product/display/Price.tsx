import { useProductContext } from '@/contexts';
import { ProductVariation } from '@/models/Product/ProductVariation';
import { SimpleProduct } from '@/models/Product/SimpleProduct';

import { formatPrice } from '@/lib/helpers';
import { SizableText, SizableTextProps, XStack } from 'tamagui';

export interface PriceProps {
    productOverride?: SimpleProduct | ProductVariation;
}

export const Price = ({ productOverride, fontSize = "$5" }: PriceProps & SizableTextProps) => {

    const { product, productVariation } = useProductContext();
    const activeProduct = productOverride || productVariation || product;

    if (activeProduct.on_sale) {
        return <XStack ai="center" gap="$2">
            <SizableText textDecorationLine="line-through" opacity={0.7} fos={fontSize}>
                {formatPrice(activeProduct.prices.regular_price)}
            </SizableText>
            <SizableText fow="bold" fos={fontSize}>
                {formatPrice(activeProduct.prices.sale_price)}
            </SizableText>
        </XStack>
    }

    return (
        <SizableText fow="bold" fos={fontSize}>
            {formatPrice(activeProduct.prices.price)}
        </SizableText>
    );
};