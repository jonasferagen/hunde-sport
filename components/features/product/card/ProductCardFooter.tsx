import { useProductContext, useShoppingCartContext } from '@/contexts';
import { capitalize } from '@/utils/helpers';
import { ChevronDown, ShoppingCart } from '@tamagui/lucide-icons';
import React from 'react';
import { Button, SizableText, XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductStatus } from '../display/ProductStatus';

interface ProductCardFooterProps {
    onExpand: () => void;
}

export const ProductCardFooter = ({ onExpand }: ProductCardFooterProps) => {
    const { product, productVariation } = useProductContext();
    const { increaseQuantity } = useShoppingCartContext();
    const activeProduct = productVariation || product;

    const handleAddToCart = () => {
        increaseQuantity({ product, productVariation: productVariation || undefined });
    };

    return (
        <XStack ai="center" jc="space-between" flex={0} gap="$2" marginHorizontal="$3">
            <XStack gap="$2" ai="center" flex={1}>
                <ProductStatus />
                {productVariation && (
                    <SizableText fontWeight="bold">
                        {capitalize(productVariation.name)}
                    </SizableText>
                )}
                <PriceTag />
                {product.hasVariations() && !productVariation && (
                    <SizableText fontSize="$2">
                        Velg variant
                    </SizableText>
                )}
            </XStack>

            <XStack gap="$2" ai="center">
                {product.hasVariations() && (
                    <YStack theme="secondary">
                        <Button
                            icon={<ChevronDown size="$4" fontWeight="bold" color="$color" />}
                            onPress={onExpand}
                            circular
                            size="$6"
                            disabled={!product.hasVariations()}
                            opacity={!product.hasVariations() ? 0.5 : 1}
                        />
                    </YStack>
                )}
                <YStack theme="primary">
                    <Button
                        icon={<ShoppingCart fontSize="$5" fontWeight="bold" />}
                        onPress={handleAddToCart}
                        circular
                        size="$6"
                        disabled={!activeProduct.isPurchasable() || !activeProduct.isInStock()}
                        opacity={!activeProduct.isPurchasable() || !activeProduct.isInStock() ? 0.5 : 1}
                    />
                </YStack>
            </XStack>
        </XStack>
    );
};
