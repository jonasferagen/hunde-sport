import { routes } from '@/config/routes';
import { Product } from '@/models/Product';
import { getScaledImageUrl } from '@/utils/helpers';
import { Link } from 'expo-router';
import React from 'react';
import { Image, SizableText, YStack } from 'tamagui';

const IMAGE_SIZE = 80;

interface ProductCardImageProps {
    product: Product;
    categoryId?: number;
    imageSize?: number;
}

export const ProductCardImage = ({ product, categoryId, imageSize = IMAGE_SIZE }: ProductCardImageProps) => {
    return (
        <YStack ai="center" jc="center">
            <Link href={routes.product(product, categoryId)}>
                <Image
                    source={{ uri: getScaledImageUrl(product.images[0]?.src, imageSize, imageSize) }}
                    width={imageSize}
                    height={imageSize}
                    borderRadius="$4"
                />
            </Link>
            <SizableText size="$1">{product.id}</SizableText>
        </YStack>
    );
};
