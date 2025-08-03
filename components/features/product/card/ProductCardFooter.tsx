import { ThemedButton } from '@/components/ui/ThemedButton';
import { useProductContext, useShoppingCartContext } from '@/contexts';
import { ChevronsDown, ChevronsUp, ShoppingCart } from '@tamagui/lucide-icons';
import React, { useRef } from 'react';
import { SizableText, StackProps, XStack } from 'tamagui';
import { DisplayPrice } from '../display/DisplayPrice';
import { ProductStatus } from '../display/ProductStatus';
import { ProductVariations } from '../variation/ProductVariations';

interface ProductCardFooterProps {
    onExpand: () => void;
    isExpanded?: boolean;
}

export const ProductCardFooter = ({ onExpand, isExpanded, ...props }: ProductCardFooterProps & StackProps) => {
    const { product, productVariation } = useProductContext();
    const { addCartItem } = useShoppingCartContext();
    const activeProduct = productVariation || product;
    const buttonRef = useRef(null);

    const handleAddToCart = () => {
        addCartItem({ product, productVariation });
    };


    return <><XStack f={1} w="100%" gap="$2" ai="center" jc="space-between" mt="$2">
        <XStack gap="$2" ai="center">
            <ThemedButton
                w={80}
                theme="secondary"
                onPress={onExpand}
                disabled={!product.hasVariations()}
            >
                {isExpanded ? <ChevronsUp size="$4" fontWeight="bold" /> : <ChevronsDown size="$4" fontWeight="bold" />}
            </ThemedButton>


            {productVariation && <SizableText numberOfLines={1} allowFontScaling fos="$3" fow="bold">{productVariation?.getVariationName(product)}</SizableText>}
        </XStack>
        <XStack gap="$2" ai="center">
            {productVariation && <DisplayPrice productPrices={productVariation.prices} />}
            <ProductStatus size="$1" />
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
    </XStack>
        {isExpanded && <ProductVariations />}
    </>
};
