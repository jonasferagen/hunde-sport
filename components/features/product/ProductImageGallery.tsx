import { useProductContext } from '@/contexts';
import { Galeria } from '@nandorojo/galeria';
import { FlashList } from '@shopify/flash-list';
import React, { useState } from 'react';
import { Image, YStack } from 'tamagui';

export const ProductImageGallery = () => {
    const { product } = useProductContext();
    const [gallery, setGallery] = useState({ visible: false, initialIndex: 0 });

    if (product.images.length <= 1) {
        return null;
    }

    const urls = product.images.map((image) => image.src);

    const openGallery = (index: number) => {
        setGallery({ visible: true, initialIndex: index });
    };

    const closeGallery = () => {
        setGallery({ visible: false, initialIndex: 0 });
    };

    return (
        <>
            <YStack height={100}>
                <Galeria urls={urls}>
                    <FlashList
                        data={urls}
                        renderItem={({ item, index }) => (
                            <YStack
                                onPress={() => openGallery(index)}
                                width={100}
                                height={100}
                                borderRadius="$2"
                                overflow="hidden"
                                borderWidth={1}
                                borderColor="$borderColor"
                                marginRight="$2"
                            >
                                <Galeria.Image index={index}>
                                    <Image source={{ uri: item }} style={{ height: '100%', width: '100%' }} />
                                </Galeria.Image>
                            </YStack>
                        )}
                        estimatedItemSize={100}
                        horizontal
                        showsHorizontalScrollIndicator
                    />
                </Galeria>
            </YStack>
        </>
    );
};
