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
    const { purchasable } = useProductContext();
    const { title, prices } = purchasable;

    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <YStack gap="$2" {...props} f={1} fg={1}>
            <XStack gap="$3">
                <XStack w={PRODUCT_CARD_LEFT_COLUMN_WIDTH} >
                    <ProductStatus size="$2" />
                </XStack>
                <XStack ai="center" jc="space-between" f={1} >
                    <SizableText>{title}</SizableText>
                    <DisplayPrice productPrices={prices} />
                </XStack>
            </XStack>

            {purchasable.product.type === "simple" ? <PurchaseButton /> :
                <VariationButton isExpanded={isExpanded} handleExpand={handleExpand} />
            }
            {isExpanded && (
                <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                ><YStack gap="$2">
                        <ProductVariations />
                        <PurchaseButton />
                    </YStack>
                </Animated.View>
            )}
        </YStack>
    );
}