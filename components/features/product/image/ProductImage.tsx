import { useProductContext, useProductImage } from '@/contexts';
import { getScaledImageUrl } from '@/utils/helpers';

import React from 'react';
import { Image, YStack } from 'tamagui';

const IMAGE_HEIGHT = 300;

export const ProductImage = () => {
    const { product, productVariant } = useProductContext();
    const { openImageViewer } = useProductImage();
    const activeProduct = productVariant || product;

    if (!activeProduct?.image) {
        return null; // Or a placeholder
    }

    const imageUrl = getScaledImageUrl(activeProduct.image.src, IMAGE_HEIGHT, IMAGE_HEIGHT);

    return (
        <YStack
            width="100%"
            height={IMAGE_HEIGHT}
            overflow="hidden"
            borderBottomWidth={1}
            borderColor="$borderColor"
            onPress={() => openImageViewer(0)}
        >
            <Image source={{ uri: imageUrl }} style={{ height: '100%', width: '100%' }} />
        </YStack>
    );
};
