import { ThemedStackProps, ThemedYStack } from '@/components/ui/ThemedStack';
import { Purchasable } from '@/types';
import { HrefObject } from 'expo-router';
import React from 'react';
import { XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductDescription } from '../display/ProductDescription';
import { ProductStatus } from '../display/ProductStatus';
import { ProductTitle } from '../display/ProductTitle';
import { PRODUCT_CARD_LEFT_COLUMN_WIDTH } from './ProductCardLeft';

interface ProductCardContentProps {
    href: HrefObject;
    purchasable: Purchasable;
}

export const ProductCardRight = ({ href, purchasable, ...stackProps }: ProductCardContentProps & ThemedStackProps) => {
    const product = purchasable.product;
    return (

        <ThemedYStack f={1} jc="flex-start" gap="$2" {...stackProps}>
            <XStack
                gap="$2"
                ai="center"
                jc="space-between">

                <ProductTitle fos="$5" product={product} />
                <YStack
                    gap="$1"
                    jc="center"
                    ai="center" >
                    <PriceTag
                        br="$5"
                        miw={PRODUCT_CARD_LEFT_COLUMN_WIDTH}
                        product={product}
                    />
                </YStack>
            </XStack>
            <ProductDescription
                product={product}
                fos="$2"
                lh='$1'
                textDecorationLine="none"
                numberOfLines={2}
                hoverStyle={{ color: '$colorHover' }}
                short={true} />
            <ProductStatus f={1} ta='right' product={product} />
        </ThemedYStack>

    );

};
