import { ThemedButton } from '@/components/ui/ThemedButton';
import { useProductContext, useShoppingCartContext } from '@/contexts';
import { ChevronsDown, ShoppingCart } from '@tamagui/lucide-icons';
import React, { useRef } from 'react';
import { StackProps, XStack } from 'tamagui';
import { ProductStatus } from '../display/ProductStatus';

interface ProductCardFooterProps {
    onExpand: () => void;
}

export const ProductCardFooter = ({ onExpand, ...props }: ProductCardFooterProps & StackProps) => {
    const { product, productVariation } = useProductContext();
    const { addCartItem } = useShoppingCartContext();
    const activeProduct = productVariation || product;
    const buttonRef = useRef(null);

    const handleAddToCart = () => {
        addCartItem({ product, productVariation });
    };


    return <XStack f={1} w="100%" gap="$2" ai="center" jc="space-between" mt="$2">
        <XStack gap="$2">

            <ThemedButton
                w={80}
                theme="secondary"
                onPress={onExpand}
                disabled={!product.hasVariations()}
            >
                <ChevronsDown size="$4" fontWeight="bold" />
            </ThemedButton>

            <ProductStatus />
        </XStack>
        <ThemedButton
            w={80}
            theme="secondary"
            onPress={handleAddToCart}
            ref={buttonRef}
            disabled={!activeProduct.isPurchasable() || !activeProduct.isInStock()}
            o={!activeProduct.isPurchasable() || !activeProduct.isInStock() ? 0.5 : 1}
        ><ShoppingCart size="$4" fontWeight="bold" />
        </ThemedButton>
    </XStack>
};
