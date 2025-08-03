import { routes } from '@/config/routes';
import { useProductContext } from '@/contexts';
import { getScaledImageUrl } from '@/utils/helpers';
import { Link } from 'expo-router';
import React from 'react';
import { Image, YStack } from 'tamagui';

const IMAGE_SIZE = 80;

interface ProductCardImageProps {
    categoryId?: number;
    imageSize?: number;
}

export const ProductCardImage = ({ categoryId, imageSize = IMAGE_SIZE }: ProductCardImageProps) => {
    const { product } = useProductContext();
    return (
        <YStack ai="center" jc="center">
            <Link href={routes.product.path(product, categoryId)}>
                <Image
                    source={{ uri: getScaledImageUrl(product.images[0]?.src, imageSize, imageSize) }}
                    width={imageSize}
                    height={imageSize}
                    borderRadius="$3"
                />
            </Link>
        </YStack>
    );
};
