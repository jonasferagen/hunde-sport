import { useProductContext } from '@/contexts';
import { formatPrice } from '@/utils/helpers';
import { ChevronsDown } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { ProductVariations } from '../variation/ProductVariations';
import { QuantityControl } from './QuantityControl';
interface ProductItemActionsProps {
    isExpanded: boolean;
    handleExpand: () => void;
}

const ProductVariationSelectionText = () => {
    const { product, productVariation } = useProductContext();


    if (productVariation) {
        return (
            <>
                <SizableText fontSize="$4" fontWeight='bold' color="$color" gap="$5">
                    {product.name}
                    - {productVariation.name.trim()}
                    {formatPrice(productVariation.price)}
                </SizableText>
            </>
        );
    }

    return (
        <SizableText color="red">
            Velg variant
        </SizableText>
    );
};

export const ProductItemActions = ({
    isExpanded,
    handleExpand
}: ProductItemActionsProps): JSX.Element => {

    const { product, productVariation } = useProductContext();
    const activeProduct = productVariation || product;

    if (!activeProduct) {
        return <YStack />;
    }

    return (
        <YStack backgroundColor="$background" padding="$2">
            <XStack jc="space-between" ai="center">
                <XStack gap="$3" ai="center">
                    {product.type === 'variable' && (
                        <XStack onPress={handleExpand} ai="center">
                            <ChevronsDown size="$4" />
                            <ProductVariationSelectionText />

                        </XStack>
                    )}
                </XStack>
                <XStack gap="$2" ai='center'>
                    <QuantityControl product={activeProduct} productVariation={productVariation ?? undefined} />
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
