import { useProductContext } from '@/contexts';
import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { Button, XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductDescription } from '../display/ProductDescription';
import { ProductTitle } from '../display/ProductTitle';
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
                    </YStack>
                </Button>
            </Link>
        </YStack >

    );

};
