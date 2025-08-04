import { useProductContext } from '@/contexts';
import { getScaledImageUrl } from '@/utils/helpers';
import { Galeria } from '@nandorojo/galeria';
import React, { JSX } from 'react';
import { Image, YStack } from 'tamagui';

const IMAGE_HEIGHT = 300;

export const ProductImage = ({ img_height = IMAGE_HEIGHT }: { img_height?: number }): JSX.Element => {
    const { product, productVariation } = useProductContext();
    const activeProduct = productVariation || product;
    const image = activeProduct.featuredImage;
    const uri = getScaledImageUrl(image.src, img_height, img_height);

    return (
        <YStack
            w="100%"
            h={img_height}
            ov="hidden"
            boc="$borderColor"
            bbw={1}
        >
            <Galeria urls={[uri!]}>
                <Galeria.Image>
                    <Image w="100%" h="100%" source={{ uri }} />
                </Galeria.Image>
            </Galeria>
        </YStack>
    );
};
