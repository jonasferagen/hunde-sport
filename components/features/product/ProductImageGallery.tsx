import { ThemedImage } from '@/components/ui/ThemedImage';
import { GridTiles } from '@/components/ui/tile/GridTiles';
import { useProductContext } from '@/contexts';
import { getScaledImageUrl } from '@/utils/helpers';
import { Galeria } from '@nandorojo/galeria';
import React, { JSX, useState } from 'react';
import { Dimensions } from 'react-native';
import { ScrollView, YStack, YStackProps } from 'tamagui';

interface ProductImageGalleryProps extends YStackProps {
    numColumns?: number;
}

export const ProductImageGallery = ({ numColumns = 4, ...stackProps }: ProductImageGalleryProps): JSX.Element => {
    const { product } = useProductContext();
    const images = product.images;
    const { width: screenWidth } = Dimensions.get('window');

    const galleryUrls = images.map((image) => getScaledImageUrl(image.src, screenWidth, screenWidth));

    const [gallery, setGallery] = useState({ visible: false, initialIndex: 0 });
    const openGallery = (index: number) => {
        setGallery({ visible: true, initialIndex: index });
    };

    return (
        <YStack f={1} {...stackProps}>
            <Galeria urls={galleryUrls}>
                <ScrollView>
                    <GridTiles
                        data={images}
                        numColumns={numColumns}
                        gap="$2"
                        // Let content dictate height; avoid forcing 100% inside ScrollView
                        renderItem={({ item: image, index }) => {
                            const thumbnailUrl = getScaledImageUrl(image.src, undefined, 200);
                            return (
                                <YStack
                                    onPress={() => openGallery(index)}
                                    br="$2"
                                    ov="hidden"
                                    f={1}
                                // Do not force flex on grid items; let image size control height
                                >
                                    <Galeria.Image index={index}>
                                        <ThemedImage

                                            source={{ uri: thumbnailUrl }}
                                            image={image}
                                            title={product.name}

                                            aspectRatio={1}
                                            objectFit="cover"
                                        />
                                    </Galeria.Image>
                                </YStack>
                            );
                        }}
                    />
                </ScrollView>
            </Galeria>
        </YStack>

    );
};
