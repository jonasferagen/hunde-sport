import { useProductContext } from '@/contexts';
import React, { useState } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { StackProps, XStack, YStack } from 'tamagui';
import { ProductStatus } from '../display/ProductStatus';
import { ProductTitle } from '../display/ProductTitle';
import { PurchaseButton } from '../display/PurchaseButton';
import { VariationButton } from '../display/VariationButton';
import { ProductVariations } from '../product-variation/ProductVariations';
interface ProductCardFooterProps extends StackProps { }

export const ProductCardFooter = (props: ProductCardFooterProps) => {
    const { purchasable } = useProductContext();
    const [isExpanded, setIsExpanded] = useState(false);
    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            <YStack p="$3" mt="$2" gap="$2" {...props} f={1} fg={1}>
                {purchasable.product.type === "variable" &&
                    <VariationButton isExpanded={isExpanded} handleExpand={handleExpand} />
                }
                {isExpanded && (
                    <Animated.View
                        entering={FadeIn}
                        exiting={FadeOut}
                    >
                        <YStack gap="$2" theme="secondary_soft">
                            <ProductVariations />
                        </YStack>
                    </Animated.View>
                )}
            </YStack>
            {purchasable.product.type === "variable" &&
                <YStack mx="none">
                    <YStack p="$3" f={1}>
                        <XStack ai="center" gap="$2" f={1} p="$2">
                            <ProductTitle variation />
                            <ProductStatus />
                        </XStack>
                        <PurchaseButton />
                    </YStack>
                </YStack>
            }
        </>
    );
}