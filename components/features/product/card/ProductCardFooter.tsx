import { ThemedButton } from '@/components/ui/ThemedButton';
import { useProductContext, useShoppingCartContext } from '@/contexts';
import { ChevronDown, ChevronUp, ShoppingCart } from '@tamagui/lucide-icons';
import React, { useRef } from 'react';
import { SizableText, StackProps, XStack, YStack } from 'tamagui';
import { DisplayPrice } from '../display/DisplayPrice';
import { ProductStatus } from '../display/ProductStatus';
import { PRODUCT_CARD_LEFT_COLUMN_WIDTH } from './index';

interface ProductCardFooterProps {
    isExpanded?: boolean;
    handleExpand?: () => void;
}

export const ProductCardFooter = ({ isExpanded, handleExpand }: ProductCardFooterProps & StackProps) => {
    const { product, productVariation, displayName } = useProductContext();
    const { addCartItem } = useShoppingCartContext();
    const activeProduct = productVariation || product;
    const buttonRef = useRef(null);

    const handleAddToCart = () => {
        addCartItem({ product, productVariation }, { triggerRef: buttonRef });
    };

    return <YStack gap="$2">
        <XStack jc="space-between" gap="$2">
            <XStack w={PRODUCT_CARD_LEFT_COLUMN_WIDTH}>
                <ProductStatus size="$2" />
            </XStack>
            <XStack f={1} fs={1} gap="$2" ai="center" jc="space-between" >
                <SizableText numberOfLines={1} allowFontScaling fos="$3" fow="bold">{displayName}</SizableText>
                <DisplayPrice productPrices={productVariation ? productVariation.prices : product.prices} />
            </XStack>
        </XStack>
        <XStack als="stretch" gap="$2" ai="center" jc="space-between">
            <YStack theme="secondary_alt1" w={PRODUCT_CARD_LEFT_COLUMN_WIDTH}>
                <ThemedButton
                    onPress={handleExpand}
                    disabled={!product.hasVariations()}
                    gap={0}
                    ai="center"
                    jc="center"
                    f={1}
                >
                    {isExpanded ? <ChevronUp size="$4" /> : <ChevronDown size="$4" />}
                </ThemedButton>
            </YStack>
            <YStack theme="primary_alt1" f={1} >
                <ThemedButton
                    f={1}
                    onPress={handleAddToCart}
                    ref={buttonRef}
                    disabled={!activeProduct.isPurchasable() || !activeProduct.isInStock()}
                    jc="space-between"
                    variant="accent"
                    iconAfter={ShoppingCart}
                    color="$colorAccentStrong"
                    fontWeight="bold"
                >
                    Legg til i handlekurv
                </ThemedButton>
            </YStack>
        </XStack>
    </YStack>
};
