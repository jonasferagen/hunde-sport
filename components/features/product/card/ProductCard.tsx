import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import React from 'react';
import { StackProps, XStack, YStack } from 'tamagui';
import { ProductVariations } from '../variation/ProductVariations';
import { ProductCardFooter } from './ProductCardFooter';
import { ProductCardLeft } from './ProductCardLeft';
import { ProductCardRight } from './ProductCardRight';

interface ProductCardProps extends StackProps {
    isExpanded: boolean;
    handleExpand: () => void;
}

export const ProductCard = ({ isExpanded, handleExpand, ...props }: ProductCardProps) => {
    return <YStack {...props} gap="$2" p="$3">
        <ThemedLinearGradient />
        <XStack f={1} w="100%" gap="$2" ai="center" jc="space-between">
            <ProductCardLeft />
            <ProductCardRight />
        </XStack>
        <ProductCardFooter isExpanded={isExpanded} handleExpand={handleExpand} />
        {isExpanded && <ProductVariations />}
    </YStack>

};
