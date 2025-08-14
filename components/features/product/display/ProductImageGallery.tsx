import { ThemedImage } from '@/components/ui/themed-components/ThemedImage';
import { GridTiles } from '@/components/ui/tile/GridTiles';
import { usePurchasableContext } from '@/contexts';
import { getScaledImageUrl } from '@/lib/helpers';
import { Galeria } from '@nandorojo/galeria';
import React, { JSX, useState } from 'react';
import { Dimensions } from 'react-native';
import { ScrollView, YStack, YStackProps } from 'tamagui';

interface ProductImageGalleryProps extends YStackProps {
    numColumns?: number;
}

export const ProductImageGallery = ({ numColumns = 4, ...stackProps }: ProductImageGalleryProps): JSX.Element => {
    const { purchasable } = usePurchasableContext();
    const { product } = purchasable;
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
                            const IMAGE_SIZE = 200;
                            const uri = getScaledImageUrl(image.src, IMAGE_SIZE, IMAGE_SIZE);

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
                                            uri={uri}
                                            title={product.name}
                                            aspectRatio={1}
                                            objectFit="cover"
                                            h={IMAGE_SIZE}
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
