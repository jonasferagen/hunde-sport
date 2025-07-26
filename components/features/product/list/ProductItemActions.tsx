import { useProductContext } from '@/contexts';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { ChevronsDown } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { Button, XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductStatus } from '../display/ProductStatus';
import { ProductVariations } from '../variation/ProductVariations';

interface ProductItemActionsProps {
    isExpanded: boolean;
    handleExpand: () => void;
}

export const ProductItemActions = ({
    isExpanded,
    handleExpand
}: ProductItemActionsProps): JSX.Element => {

    const { product, productVariation } = useProductContext();
    const activeProduct = productVariation || product;
    const { increaseQuantity } = useShoppingCartContext();

    if (!activeProduct) {
        return <YStack />;
    }

    return (
        <YStack theme="primary" backgroundColor="$background" padding="$2">
            <XStack ai="center" jc="space-between">
                <XStack gap="$2">
                    <PriceTag /><ProductStatus />
                </XStack>

                <Button
                    onPress={() => increaseQuantity(product, productVariation || undefined)}
                    disabled={!activeProduct.isPurchasable()}
                >
                    Kjøp
                </Button>

                {product.type === 'variable' && (
                    <XStack onPress={handleExpand} ai="center">
                        <ChevronsDown size="$4" />
                    </XStack>
                )}
            </XStack>
            {
                isExpanded && (
                    <YStack marginHorizontal="$3" mt="$2">
                        <ProductVariations />
                    </YStack>
                )
            }
        </YStack >
    );
};
