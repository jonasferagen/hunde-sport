import { ThemedImage } from '@/components/ui/themed-components/ThemedImage';
import { usePurchasableContext } from '@/contexts';
import { getScaledImageUrl } from '@/lib/helpers';
import { Galeria } from '@nandorojo/galeria';
import React, { JSX, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import { ScrollView, XStack, YStack, YStackProps } from 'tamagui';

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


    const [containerW, setContainerW] = useState(0);
    const gapPx = 8;

    // compute square tile size
    const itemSize = useMemo(() => {
        if (!containerW || !numColumns) return 0;
        const totalGutters = gapPx * (numColumns - 1);
        return Math.floor((containerW - totalGutters) / numColumns);
    }, [containerW, numColumns, gapPx]);

    const THUMBNAIL_WIDTH = Math.floor(screenWidth / numColumns);


    return (
        <YStack f={1} {...stackProps}>
            <Galeria urls={galleryUrls}>
                <ScrollView>
                    <XStack
                        fw="wrap"
                        // RN supports gap on wrap in recent versions, but margins are the most reliable.
                        onLayout={(e) => setContainerW(e.nativeEvent.layout.width)}
                        // use gap for simple cases; margins handle older platforms
                        gap="$2"
                    >
                        {images.map((image, index) => {
                            // fallback if layout not measured yet
                            const size = itemSize || THUMBNAIL_WIDTH;
                            const uri = getScaledImageUrl(image.src, size, size);

                            return (
                                <YStack
                                    key={index}
                                    w={size}
                                    h={size}
                                    br="$2"
                                    ov="hidden"
                                    onPress={() => openGallery(index)}
                                >
                                    <Galeria.Image index={index}>
                                        <ThemedImage
                                            uri={uri}
                                            title={product.name}
                                            aspectRatio={1}
                                            objectFit="cover"
                                            w="100%"
                                            h="100%"
                                        />
                                    </Galeria.Image>
                                </YStack>
                            );
                        })}
                    </XStack>
                </ScrollView>
            </Galeria>
        </YStack>

    );
};

