import { useProductContext } from '@/contexts';
import { getScaledImageUrl } from '@/utils/helpers';
import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { Image, YStack } from 'tamagui';
export const PRODUCT_CARD_LEFT_COLUMN_WIDTH = 80;

interface ProductCardImageProps {
    href: HrefObject;
}

export const ProductCardLeft = ({ href }: ProductCardImageProps) => {
    const { product } = useProductContext();
    const imageSize = PRODUCT_CARD_LEFT_COLUMN_WIDTH;

    return <YStack>
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
