import { ThemedImage } from '@/components/ui/ThemedImage';
import { useProductContext } from '@/contexts';
import { getScaledImageUrl } from '@/utils/helpers';
import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { YStack } from 'tamagui';

export const PRODUCT_CARD_LEFT_COLUMN_WIDTH = 80;

interface ProductCardImageProps {
    href: HrefObject;
}

export const ProductCardLeft = ({ href }: ProductCardImageProps) => {
    const { purchasable: validatedPurchasable } = useProductContext();
    const { displayProduct } = validatedPurchasable;

    const image = displayProduct.featuredImage;
    const imageSize = PRODUCT_CARD_LEFT_COLUMN_WIDTH;
    const uri = getScaledImageUrl(image.src, imageSize, imageSize);

    return (
        <Link href={href}>
            <YStack w={imageSize} h={imageSize} br="$3" boc="$borderColorStrong" bw={1} overflow="hidden">
                <ThemedImage source={{ uri }} image={image} title={displayProduct.name} w={imageSize} h={imageSize} />
            </YStack>
        </Link>
    );
};
