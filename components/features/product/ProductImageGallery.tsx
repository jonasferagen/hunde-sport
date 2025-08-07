import { useProductContext } from '@/contexts';
import { Galeria } from '@nandorojo/galeria';
import { FlashList } from '@shopify/flash-list';
import React, { JSX, useState } from 'react';
import { Image, YStack } from 'tamagui';

export const ProductImageGallery = (): JSX.Element => {
    const { product } = useProductContext();
    const urls = product.images.map((image) => image.src);

    const [gallery, setGallery] = useState({ visible: false, initialIndex: 0 });
    const openGallery = (index: number) => {
        setGallery({ visible: true, initialIndex: index });
    };

    return (
        <>
            <YStack h={100}>
                <Galeria urls={urls} closeIconName="xmark.circle.fill">
                    <FlashList
                        data={urls}
                        renderItem={({ item, index }) => (
                            <YStack
                                onPress={() => openGallery(index)}
                                w={100}
                                h={100}
                                br="$2"
                                ov="hidden"
                                bw={1}
                                boc="$borderColor"
                                mr="$2"
                            >
                                <Galeria.Image index={index}>
                                    <YStack>
                                        <Image
                                            source={{ uri: item }}
                                            h="100%"
                                            w="100%" />
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
