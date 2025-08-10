import { ThemedStackProps, ThemedYStack } from '@/components/ui/ThemedStack';
import { useBaseProductContext } from '@/contexts/BaseProductContext';
import React from 'react';
import { XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductDescription } from '../display/ProductDescription';
import { ProductStatus } from '../display/ProductStatus';
import { ProductTitle } from '../display/ProductTitle';
import { PRODUCT_CARD_LEFT_COLUMN_WIDTH } from './ProductCardLeft';

interface ProductCardContentProps {
}

export const ProductCardRight = ({ ...stackProps }: ProductCardContentProps & ThemedStackProps) => {
    const { product } = useBaseProductContext();
    return (

        <ThemedYStack f={1} jc="flex-start" gap="$2" {...stackProps}>
            <XStack
                gap="$2"
                ai="center"
                jc="space-between">

                <ProductTitle />
                <YStack
                    gap="$1"
                    jc="center"
                    ai="center" >
                    <PriceTag
                        br="$5"
                        miw={PRODUCT_CARD_LEFT_COLUMN_WIDTH}

                    />
                </YStack>
            </XStack>ProductCardRight
            <ProductDescription
                fos="$2"
                lh='$1'
                textDecorationLine="none"
                numberOfLines={2}
                hoverStyle={{ color: '$colorHover' }}
                short={true} />
            <ProductStatus f={1} ta='right' />
        </ThemedYStack>
    );
};
