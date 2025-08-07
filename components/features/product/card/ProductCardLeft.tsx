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
    const { purchasable: validatedPurchasable } = useProductContext();
    const { displayProduct } = validatedPurchasable;

    const src = displayProduct.featuredImage.src || '';
    const imageSize = PRODUCT_CARD_LEFT_COLUMN_WIDTH;
    const uri = getScaledImageUrl(src, imageSize, imageSize);

    return <Link href={href}>
        <YStack

            w={imageSize}
            h={imageSize}
            br="$3"
            boc="$borderColorStrong"
            bw={1}
            overflow="hidden"
        >
            <Image
                source={{ uri }}
                w={imageSize}
                h={imageSize}
            />
        </YStack>
    </Link>
};
