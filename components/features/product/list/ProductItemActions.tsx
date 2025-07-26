import { useProductContext } from '@/contexts';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { ArrowBigRight, ChevronsDown, ShoppingCart } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { Pressable } from 'react-native';
import { Button, H6, XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductStatus } from '../display/ProductStatus';
import { ProductVariations } from '../variation/ProductVariations';
interface ProductItemActionsProps {
    isExpanded: boolean;
    handleExpand: () => void;
}

const ProductVariationSelectionText = () => {


    return (
        <>
            <XStack flex={0} ai="center" jc="space-between" borderColor='green' borderWidth={1}>
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
    const { status, msg } = useShoppingCartContext().purchaseInfo(productVariation || product);

    if (!activeProduct) {
        return <YStack />;
    }

    return (
        <YStack theme="primary" backgroundColor="$background" padding="$2">
            <XStack ai="center" jc="space-between">
                <XStack gap="$2">
                    {productVariation && <H6>{product.name}</H6>}
                    <PriceTag />
                    <ProductStatus />
                </XStack>
                <XStack gap="$3" ai="center">
                    {product.type === 'variable' && false && (
                        <XStack onPress={handleExpand} ai="center">
                            <ChevronsDown size="$4" />
                            <ProductVariationSelectionText />
                        </XStack>
                    )}
                </XStack>

                <XStack gap="$2" ai='center'>
                    <Pressable onPress={() => useShoppingCartContext().increaseQuantity(product, productVariation || undefined)}>
                        <XStack ai="center" jc="center">
                            <ArrowBigRight size="$3" />
                            <ShoppingCart size="$4" />
                        </XStack>
                    </Pressable>
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
