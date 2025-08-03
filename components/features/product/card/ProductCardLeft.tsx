import { routes } from '@/config/routes';
import { useProductContext } from '@/contexts';
import { useCategoryContext } from '@/contexts/CategoryContext';
import { getScaledImageUrl } from '@/utils/helpers';
import { Link } from 'expo-router';
import React from 'react';
import { Image, YStack } from 'tamagui';
import { PRODUCT_CARD_LEFT_COLUMN_WIDTH } from './index';

interface ProductCardImageProps {
    imageSize?: number;
}

export const ProductCardLeft = ({ imageSize = PRODUCT_CARD_LEFT_COLUMN_WIDTH }: ProductCardImageProps) => {
    const { product } = useProductContext();
    const { category } = useCategoryContext();

    return <YStack ai="center" jc="center">
        <Link href={routes.product.path(product, category?.id)}>
            <Image
                source={{ uri: getScaledImageUrl(product.images[0]?.src, imageSize, imageSize) }}
                width={imageSize}
                height={imageSize}
                borderRadius="$3"
            />
        </Link>
    </YStack>

};
