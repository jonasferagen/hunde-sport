import { useProductContext } from '@/contexts';
import { formatPrice } from '@/utils/helpers';
import { AlertCircle, ChevronsDown } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { QuantityControl } from '../../shoppingCart/QuantityControl';
import { ProductInfo } from '../display/ProductInfo';
import { ProductVariations } from '../variation/ProductVariations';
interface ItemActionsProps {
    isExpanded: boolean;
    handleExpand: () => void;
}

const VariantSelectionText = () => {
    const { product, productVariation } = useProductContext();

    if (!product || !productVariation) {
        return null;
    }

    if (productVariation.type === 'variation') {
        return (
            <>
                <SizableText color="$color">
                    {product.name} - <SizableText fontWeight="bold" color="$color">{productVariation.name.trim()}</SizableText>
                </SizableText>
                <SizableText fontWeight="bold" color="$color">
                    {formatPrice(productVariation.price)}
                </SizableText>
            </>
        );
    }

    return (
        <SizableText color="$gray10">
            Velg variant
        </SizableText>
    );
};

export const ItemActions = ({
    isExpanded,
    handleExpand
}: ItemActionsProps): JSX.Element => {

    const { product, productVariation } = useProductContext();
    const activeProduct = productVariation || product;

    if (!activeProduct) {
        return <YStack />;
    }

    return (
        <YStack theme='secondary' backgroundColor="$background" padding="$2">
            <XStack jc="space-between" ai="center">
                <XStack gap="$3" ai="center">
                    {product.type === 'variable' && (
                        <XStack onPress={handleExpand} ai="center">
                            <ChevronsDown size="$4" />
                            <VariantSelectionText />

                        </XStack>
                    )}
                </XStack>
                {productVariation && (
                    <ProductInfo product={activeProduct} />
                )}
                <XStack gap="$2" ai='center'>
                    {activeProduct.stock_status === 'outofstock' ? (
                        <XStack gap="$1" ai="center">
                            <AlertCircle size="$3" color="red" />
                            <SizableText color="red">Ikke på lager</SizableText>
                        </XStack>
                    ) : (
                        <QuantityControl product={activeProduct} productVariation={productVariation} />
                    )}
                </XStack>
            </XStack>
            {isExpanded && (
                <YStack marginHorizontal="$3" mt="$2">
                    <ProductVariations />
                </YStack>
            )}
        </YStack>
    );
};
