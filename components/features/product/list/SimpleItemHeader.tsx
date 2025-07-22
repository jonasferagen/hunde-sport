import { Product } from '@/models/Product';
import { getScaledImageUrl } from '@/utils/helpers';
import React, { JSX, ReactNode } from 'react';
import { Image, XStack, YStack } from 'tamagui';
import { ProductTitle } from '../display/ProductTitle';

interface SimpleItemHeaderProps {
    product: Product;
    children?: ReactNode;
}

const IMAGE_SIZE = 80;

export const SimpleItemHeader = ({ product, children }: SimpleItemHeaderProps): JSX.Element => {
    const imageUrl = getScaledImageUrl(product.images[0]?.src, IMAGE_SIZE, IMAGE_SIZE);

    return (
        <XStack
            alignSelf="stretch"
            justifyContent="flex-start"
            gap="$3"
            flex={1}
        >
            <YStack
                alignItems="center"
                justifyContent="center"
            >
                <Image source={{ uri: imageUrl }} width={IMAGE_SIZE} height={IMAGE_SIZE} borderRadius="$4" />
            </YStack>
            <YStack flex={1} gap="$2">
                <ProductTitle product={product} />
                {children}
            </YStack>
        </XStack>
    );
};
