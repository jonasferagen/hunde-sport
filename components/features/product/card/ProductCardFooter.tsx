import { ThemedButton } from '@/components/ui/ThemedButton';
import { useProductContext, useShoppingCartContext } from '@/contexts';
import { ArrowBigRightDash, ChevronsDown, ChevronsUp } from '@tamagui/lucide-icons';
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

    const buttonText = !activeProduct.isPurchasable() ? 'Velg en variant' : activeProduct.is_in_stock ? 'Legg til i handlekurv' : 'Utsolgt';
    const disabled = !activeProduct.isPurchasable() || !activeProduct.is_in_stock;

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
        <XStack gap="$2" ai="center" jc="space-between" theme="secondary_alt3">

            <ThemedButton
                onPress={handleExpand}
                disabled={!product.hasVariations()}
                gap={0}
                ai="center"
                jc="center"
                p="none"
                m="none"
                icon={isExpanded ? <ChevronsUp /> : <ChevronsDown />}
                w={PRODUCT_CARD_LEFT_COLUMN_WIDTH}
                variant="accent"
                scaleIcon={1.5}
            />

            <ThemedButton
                f={1}
                onPress={handleAddToCart}
                ref={buttonRef}
                disabled={disabled}
                jc="space-between"
                variant="accent"
                scaleIcon={1.5}
                iconAfter={<ArrowBigRightDash />}
                fontWeight="bold"
                fontSize="$4"
            >
                {buttonText}
            </ThemedButton>
        </XStack>
    </YStack>
};
