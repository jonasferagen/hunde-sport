import { useProductContext } from '@/contexts';
import React, { useState } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { StackProps, YStack } from 'tamagui';
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
        <YStack mt="$2" gap="$2" {...props} f={1} fg={1}>
            {purchasable.product.type === "simple" ? <PurchaseButton /> :
                <VariationButton isExpanded={isExpanded} handleExpand={handleExpand} />
            }
            {isExpanded && (
                <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                ><YStack gap="$2" theme="secondary_soft">
                        <ProductVariations />
                        <PurchaseButton />
                    </YStack>
                </Animated.View>
            )}
        </YStack>
    );
}