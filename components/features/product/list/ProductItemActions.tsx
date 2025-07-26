import { useProductContext } from '@/contexts';
import { ChevronsDown } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { Button, XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductStatus } from '../display/ProductStatus';
import { ProductVariations } from '../variation/ProductVariations';
import { QuantityControl } from './QuantityControl';
interface ProductItemActionsProps {
    isExpanded: boolean;
    handleExpand: () => void;
}

const ProductVariationSelectionText = () => {


    return (
        <>
            <XStack flex={0} ai="center" justifyContent="space-between" borderColor='green' borderWidth={1}>
                <XStack gap="$2">
                    <PriceTag /><ProductStatus />
                </XStack>
                <Button>Kjøp</Button>
            </XStack>
        </>
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
                    {product.type === 'variable' && false && (
                        <XStack onPress={handleExpand} ai="center">
                            <ChevronsDown size="$4" />
                            <ProductVariationSelectionText />
                        </XStack>
                    )}
                </XStack>

                <XStack gap="$2" ai='center'>
                    <QuantityControl product={product} productVariation={productVariation ?? undefined} />
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
