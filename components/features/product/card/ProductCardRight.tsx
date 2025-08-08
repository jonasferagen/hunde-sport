import { Chip } from '@/components/ui';
import { useProductContext } from '@/contexts';
import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { Button, H6, XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductDescription } from '../display/ProductDescription';
import { PRODUCT_CARD_LEFT_COLUMN_WIDTH } from './ProductCardLeft';

interface ProductCardContentProps {
    href: HrefObject;
}

export const ProductCardRight = ({ href }: ProductCardContentProps) => {
    const { product } = useProductContext();

    return (
        <YStack f={1}>
            <Link href={href} asChild>
                <Button unstyled pressStyle={{ opacity: 0.7 }}>
                    <YStack f={1} jc="flex-start" gap="$2">
                        <XStack gap="$2" ai="flex-start" jc="space-between">
                            <H6
                                f={0}
                                fs={1}
                                lh='$2'
                                numberOfLines={2}
                                textDecorationLine="none"
                                hoverStyle={{ color: '$colorHover' }}
                            >
                                {product.name}
                            </H6>
                            <YStack gap="$1" jc="center" ai="center">
                                <Chip theme="secondary_alt1" minWidth={PRODUCT_CARD_LEFT_COLUMN_WIDTH}>
                                    <PriceTag />
                                </Chip>
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
