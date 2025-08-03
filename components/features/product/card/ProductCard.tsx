import React from 'react';
import { StackProps, XStack, YStack } from 'tamagui';
import { ProductVariations } from '../variation/ProductVariations';
import { ProductCardFooter } from './ProductCardFooter';
import { ProductCardLeft } from './ProductCardLeft';
import { ProductCardRight } from './ProductCardRight';

interface ProductCardProps extends StackProps {
    isExpanded: boolean;
    handleExpand: () => void;
    categoryId?: number;
}

export const ProductCard = ({ isExpanded, handleExpand, categoryId, ...props }: ProductCardProps) => {
    return (
        <YStack {...props} gap="$2">
            <XStack f={1} w="100%" gap="$2" ai="center" jc="space-between">
                <ProductCardLeft categoryId={categoryId} />
                <ProductCardRight categoryId={categoryId} />
            </XStack>
            <ProductCardFooter isExpanded={isExpanded} handleExpand={handleExpand} />
            {isExpanded && <ProductVariations />}
        </YStack>
    );
};
