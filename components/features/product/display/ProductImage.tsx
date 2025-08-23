import { ThemedYStack } from '@/components/ui';
import { ThemedImage } from '@/components/ui/themed-components/ThemedImage';
import { getScaledImageUrl } from '@/lib/helpers';
import { Product } from '@/types';
import { Galeria } from '@nandorojo/galeria';
import React from 'react';
import { Dimensions } from 'react-native';
import { YStackProps } from 'tamagui';

const IMAGE_HEIGHT = 300;

interface ProductImageProps {
    product: Product;
    img_height?: number;
    stackProps?: YStackProps;
}

export const ProductImage = ({ product, img_height = IMAGE_HEIGHT, ...stackProps }: ProductImageProps) => {

    const { width: screenWidth } = Dimensions.get('window');
    const image = product.featuredImage;
    const uri = getScaledImageUrl(image.src, screenWidth, screenWidth);

    return (
        <ThemedYStack
            w="100%"
            h={img_height}
            ov="hidden"
            boc="$borderColor"
            br="$3"
            {...stackProps}>
            <Galeria urls={[uri!]}>
                <Galeria.Image>
                    <ThemedImage
                        w="100%"
                        h="100%"
                        uri={uri}
                        title={product.name}
                    />
                </Galeria.Image>
            </Galeria>
        </ThemedYStack>
    );
};
