import { useProductContext, useProductImage } from '@/contexts';
import { Image } from 'expo-image';
import React from 'react';
import { XStack, YStack } from 'tamagui';


export const ProductImageGallery = () => {
    const { product } = useProductContext();
    const { openImageViewer } = useProductImage();

    if (!product.images || product.images.length <= 1) {
        console.log("No images for product", product.name)
        return <></>;
    }

    const galleryImages = product.images.slice(1);

    return (
        <XStack gap="$2">
            {galleryImages.map((image, index) => (
                <YStack
                    key={'imageGalleryItem-' + index}
                    width={100}
                    height={100}
                    borderRadius="$2"
                    borderWidth={1}
                    borderColor="$borderColor"
                    overflow="hidden"
                    onPress={() => openImageViewer(index + 1)}
                >
                    <Image source={{ uri: image.src }} style={{ height: '100%', width: '100%' }} />
                </YStack>
            ))}
        </XStack>
    );
};
