import { useProductContext } from '@/contexts';
import { getScaledImageUrl } from '@/utils/helpers';
import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { Image, YStack } from 'tamagui';
import { PRODUCT_CARD_LEFT_COLUMN_WIDTH } from './index';

interface ProductCardImageProps {
    imageSize?: number;
    href: HrefObject;
}

export const ProductCardLeft = ({ imageSize = PRODUCT_CARD_LEFT_COLUMN_WIDTH, href }: ProductCardImageProps) => {
    const { product } = useProductContext();

    return <YStack ai="center" jc="center">
        <Link href={href}>
            <Image
                source={{ uri: getScaledImageUrl(product.images[0]?.src, imageSize, imageSize) }}
                w={imageSize}
                h={imageSize}
                br="$3"
            />
        </Link>
    </YStack>

};
