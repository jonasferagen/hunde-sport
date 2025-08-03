import { ThemedButton } from '@/components/ui/ThemedButton';
import { useProductContext, useShoppingCartContext } from '@/contexts';
import { capitalize } from '@/utils/helpers';
import { ChevronsDown, ShoppingCart } from '@tamagui/lucide-icons';
import React, { useRef } from 'react';
import { SizableText, StackProps, XStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
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

    return (
        <XStack f={0} ai="center" jc="space-between" gap="$3" mb="$2">

            <XStack f={1} gap="$2" ai="center">
                <ProductStatus />
                <PriceTag />

                {productVariation && (
                    <SizableText fow="bold">
                        {capitalize(productVariation.name)}
                    </SizableText>
                )
                }


            </XStack >

            <XStack gap="$2" ai="center">
                {product.hasVariations() && (

                    <ThemedButton
                        theme="secondary"
                        icon={<ChevronsDown size="$4" fontWeight="bold" />}
                        onPress={onExpand}
                        br="$6"
                        circular
                        size="$6"

                    />

                )}

                <ThemedButton
                    theme="secondary"
                    icon={<ShoppingCart size="$4" fontWeight="bold" />}
                    onPress={handleAddToCart}
                    ref={buttonRef}
                    circular
                    size="$6"
                    disabled={!activeProduct.isPurchasable() || !activeProduct.isInStock()}
                    o={!activeProduct.isPurchasable() || !activeProduct.isInStock() ? 0.5 : 1}

                />

            </XStack>
        </XStack >
    );
};
