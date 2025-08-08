import { useProductContext } from '@/contexts';
import { getScaledImageUrl } from '@/utils/helpers';
import { Galeria } from '@nandorojo/galeria';
import { FlashList } from '@shopify/flash-list';
import React, { JSX, useState } from 'react';
import { Dimensions } from 'react-native';
import { YStack } from 'tamagui';
import { ThemedImage } from '../../ui/ThemedImage';

export const ProductImageGallery = (): JSX.Element => {
    const { product } = useProductContext();
    const images = product.images;
    const { width: screenWidth } = Dimensions.get('window');

    const galleryUrls = images.map((image) => getScaledImageUrl(image.src, screenWidth, screenWidth));

    const [gallery, setGallery] = useState({ visible: false, initialIndex: 0 });
    const openGallery = (index: number) => {
        setGallery({ visible: true, initialIndex: index });
    };

    return (
        <>
            <YStack h={100}>
                <Galeria urls={galleryUrls}>
                    <FlashList
                        data={images}
                        renderItem={({ item: image, index }) => {
                            const thumbnailUrl = getScaledImageUrl(image.src, 100, 100);
                            return (
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
                                            <ThemedImage
                                                source={{ uri: thumbnailUrl }}
                                                image={image}
                                                title={product.name}
                                                h="100%"
                                                w="100%"
                                            />
                                        </YStack>
                                    </Galeria.Image>
                                </YStack>
                            );
                        }}
                        estimatedItemSize={100}
                        horizontal
                        showsHorizontalScrollIndicator
                    />
                </Galeria>
            </YStack>
        </>
    );
};
