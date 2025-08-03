import { useProductContext, useShoppingCartContext } from '@/contexts';
import { capitalize } from '@/utils/helpers';
import { ChevronDown, ShoppingCart } from '@tamagui/lucide-icons';
import React, { useRef } from 'react';
import { Button, SizableText, XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductStatus } from '../display/ProductStatus';

interface ProductCardFooterProps {
    onExpand: () => void;
}

export const ProductCardFooter = ({ onExpand }: ProductCardFooterProps) => {
    const { product, productVariation } = useProductContext();
    const { addCartItem } = useShoppingCartContext();
    const activeProduct = productVariation || product;
    const buttonRef = useRef(null);

    const handleAddToCart = () => {
        addCartItem({ product, productVariation });
    };

    return (
        <XStack f={0} ai="center" jc="space-between" gap="$2">
            <XStack f={1} gap="$2" ai="center">
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
                        />
                    </YStack>
                )}
                <YStack theme="primary">
                    <Button
                        icon={<ShoppingCart fontSize="$5" fontWeight="bold" />}
                        onPress={handleAddToCart}
                        ref={buttonRef}
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
