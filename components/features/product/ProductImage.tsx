import { useProductContext } from '@/contexts';
import { getScaledImageUrl } from '@/utils/helpers';
import { Galeria } from '@nandorojo/galeria';
import React from 'react';
import { Image, YStack } from 'tamagui';

const IMAGE_HEIGHT = 300;

export const ProductImage = () => {
    const { product, productVariation } = useProductContext();
    const activeProduct = productVariation || product;

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
        >
            <Galeria urls={[imageUrl!]}>
                <Galeria.Image>
                    <Image source={{ uri: imageUrl }} style={{ height: '100%', width: '100%' }} />
                </Galeria.Image>
            </Galeria>
        </YStack>
    );
};
