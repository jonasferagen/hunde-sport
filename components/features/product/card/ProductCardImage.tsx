import { routes } from '@/config/routes';
import { Product } from '@/models/Product';
import { getScaledImageUrl } from '@/utils/helpers';
import { Link } from 'expo-router';
import React from 'react';
import { Image, YStack } from 'tamagui';

const IMAGE_SIZE = 80;

interface ProductCardImageProps {
    product: Product;
    categoryId?: number;
}

export const ProductCardImage = ({ product, categoryId }: ProductCardImageProps) => {
    return (
        <YStack>
            <Link href={routes.product(product, categoryId)}>
                <Image
                    source={{ uri: getScaledImageUrl(product.images[0]?.src, IMAGE_SIZE, IMAGE_SIZE) }}
                    width={IMAGE_SIZE}
                    height={IMAGE_SIZE}
                    borderRadius="$4"
                />
            </Link>
        </YStack>
    );
};
