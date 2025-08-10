import { ThemedStackProps, ThemedYStack } from '@/components/ui/themed-components/ThemedStack';
import React from 'react';
import { XStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductDescription } from '../display/ProductDescription';
import { ProductTitle } from '../display/ProductTitle';
import { PRODUCT_CARD_LEFT_COLUMN_WIDTH } from './ProductCardLeft';

interface ProductCardContentProps {
}

export const ProductCardRight = ({ ...stackProps }: ProductCardContentProps & ThemedStackProps) => {

    return (

        <ThemedYStack f={1} jc="flex-start" gap="$2" {...stackProps}>
            <XStack
                gap="$2"
                ai="flex-start"
                jc="space-between"
            >
                <ProductTitle fs={1} />
                <PriceTag
                    fs={0}
                    br="$5"
                    miw={PRODUCT_CARD_LEFT_COLUMN_WIDTH}
                />
            </XStack>
            <ProductDescription
                fos="$2"
                lh='$1'
                textDecorationLine="none"
                numberOfLines={2}

                short={true} />

        </ThemedYStack>
    );
};
