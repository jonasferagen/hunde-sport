import { ThemedText } from '@/components/ui/ThemedText';
import { useProductContext } from '@/contexts';
import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { Button, XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductDescription } from '../display/ProductDescription';
import { PRODUCT_CARD_LEFT_COLUMN_WIDTH } from './ProductCardLeft';

interface ProductCardContentProps {
    href: HrefObject;
}

export const ProductCardRight = ({ href }: ProductCardContentProps) => {
    const { purchasable } = useProductContext();
    const { activeProduct } = purchasable;



    return (
        <YStack f={1}>
            <Link href={href} asChild>
                <Button unstyled pressStyle={{ opacity: 0.7 }}>
                    <YStack f={1} jc="flex-start" gap="$2">
                        <XStack gap="$2" ai="flex-start" jc="space-between">

                            <ThemedText
                                f={0}
                                fs={1}
                                lh='$2'
                                fontSize="$5"
                                numberOfLines={2}
                                textDecorationLine="none"
                            >
                                {activeProduct.name}
                            </ThemedText>
                            <YStack gap="$1" jc="center" ai="center" >
                                <PriceTag br="$5" miw={PRODUCT_CARD_LEFT_COLUMN_WIDTH} />
                            </YStack>
                        </XStack>
                        <ProductDescription
                            fos="$1"
                            col="$color"
                            lh='$2'
                            textDecorationLine="none"
                            numberOfLines={2}
                            hoverStyle={{ color: '$colorHover' }}
                            short={true} />
                    </YStack>
                </Button>
            </Link>
        </YStack >
    );

};
