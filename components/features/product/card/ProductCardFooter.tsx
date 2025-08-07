import { useProductContext } from '@/contexts';
import React, { useState } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SizableText, StackProps, XStack, YStack } from 'tamagui';
import { DisplayPrice } from '../display/DisplayPrice';
import { ProductStatus } from '../display/ProductStatus';
import { PurchaseButton } from '../display/PurchaseButton';
import { VariationButton } from '../display/VariationButton';
import { ProductVariations } from '../product-variation/ProductVariations';
import { PRODUCT_CARD_LEFT_COLUMN_WIDTH } from './ProductCardLeft';
interface ProductCardFooterProps extends StackProps { }

export const ProductCardFooter = (props: ProductCardFooterProps) => {
    const { validatedPurchasable } = useProductContext();
    const { displayProduct } = validatedPurchasable;

    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    return (
        <YStack gap="$2" {...props} >
            <XStack gap="$3">
                <XStack w={PRODUCT_CARD_LEFT_COLUMN_WIDTH} >
                    <ProductStatus size="$2" />
                </XStack>
                <XStack ai="center" jc="space-between" f={1} >
                    <SizableText>{displayProduct.name}</SizableText>
                    <DisplayPrice productPrices={displayProduct.prices} />
                </XStack>
            </XStack>

            <VariationButton isExpanded={isExpanded} handleExpand={handleExpand} />
            {isExpanded &&
                <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                >
                    <ProductVariations />
                </Animated.View>
            }
            <PurchaseButton />
        </YStack >


    );
}