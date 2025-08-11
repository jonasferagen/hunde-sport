import { ThemedImage } from '@/components/ui/themed-components/ThemedImage';
import { usePurchasableContext } from '@/contexts/';
import { getScaledImageUrl } from '@/lib/helpers';
import { Galeria } from '@nandorojo/galeria';
import React, { JSX } from 'react';
import { Dimensions } from 'react-native';
import { YStack, YStackProps } from 'tamagui';

const IMAGE_HEIGHT = 300;

interface ProductImageProps {
    img_height?: number;
    stackProps?: YStackProps;
}

export const ProductImage = ({ img_height = IMAGE_HEIGHT, ...stackProps }: ProductImageProps): JSX.Element => {
    const { purchasable } = usePurchasableContext();
    const { activeProduct } = purchasable;
    const { width: screenWidth } = Dimensions.get('window');
    const image = activeProduct.featuredImage;
    const uri = getScaledImageUrl(image.src, screenWidth, screenWidth);

    return (
        <YStack w="100%" h={img_height} ov="hidden" boc="$borderColor" bbw={1} {...stackProps}>
            <Galeria urls={[uri!]}>
                <Galeria.Image>
                    <ThemedImage
                        w="100%"
                        h="100%"
                        source={{ uri }}
                        image={image}
                        title={activeProduct.name}
                    />
                </Galeria.Image>
            </Galeria>
        </YStack>
    );
};
