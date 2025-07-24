
import { useProductContext } from '@/contexts';
import { getScaledImageUrl } from '@/utils/helpers';
import { Image } from 'expo-image';
import React from 'react';
import { YStack } from 'tamagui';

interface ProductImageProps {
    onPress: () => void;
}

const IMAGE_HEIGHT = 300;

export const ProductImage = ({ onPress }: ProductImageProps) => {
    const { product, productVariant } = useProductContext();
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
            onPress={onPress}
        >
            <Image source={{ uri: imageUrl }} style={{ height: '100%', width: '100%' }} />
        </YStack>
    );
};
