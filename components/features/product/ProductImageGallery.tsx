import { useProductContext } from '@/contexts';
import { Galeria } from '@nandorojo/galeria';
import { FlashList } from '@shopify/flash-list';
import { Plus } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { Image, SizableText, YStack } from 'tamagui';

export const ProductImageGallery = () => {
    const { product } = useProductContext();
    const [gallery, setGallery] = useState({ visible: false, initialIndex: 0 });

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
                <Galeria urls={urls} closeIconName="xmark.circle.fill">
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
                                    <YStack>
                                        <Image source={{ uri: item }} style={{ height: '100%', width: '100%' }} />
                                        {gallery.visible && <Plus size={24} color="red" />}
                                        <SizableText size="$6" color="blue">xxxx</SizableText>
                                    </YStack>
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
