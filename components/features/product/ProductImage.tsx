import { ThemedImage } from '@/components/ui/themed-components/ThemedImage';
import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { getScaledImageUrl } from '@/lib/helpers';
import { Galeria } from '@nandorojo/galeria';
import React, { JSX } from 'react';
import { Dimensions } from 'react-native';
import { YStack } from 'tamagui';

const IMAGE_HEIGHT = 300;

export const ProductImage = ({ img_height = IMAGE_HEIGHT }: { img_height?: number }): JSX.Element => {
    const { product } = useBaseProductContext();
    const { width: screenWidth } = Dimensions.get('window');

    const image = product.featuredImage;
    const uri = getScaledImageUrl(image.src, screenWidth, screenWidth);

    return (
        <YStack w="100%" h={img_height} ov="hidden" boc="$borderColor" bbw={1}>
            <Galeria urls={[uri!]}>
                <Galeria.Image>
                    <ThemedImage
                        w="100%"
                        h="100%"
                        source={{ uri }}
                        image={image}
                        title={product.name}
                    />
                </Galeria.Image>
            </Galeria>
        </YStack>
    );
};
