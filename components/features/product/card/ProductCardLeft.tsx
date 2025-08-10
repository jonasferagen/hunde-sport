import { ThemedImage } from '@/components/ui/ThemedImage';
import { useBaseProductContext } from '@/contexts/BaseProductContext';
import { getScaledImageUrl } from '@/lib/helpers';
import React from 'react';
import { YStack, YStackProps } from 'tamagui';

export const PRODUCT_CARD_LEFT_COLUMN_WIDTH = 80;

interface ProductCardImageProps {
    props?: YStackProps;
}

export const ProductCardLeft = ({ props }: ProductCardImageProps) => {

    const { product } = useBaseProductContext();

    const imageSize = PRODUCT_CARD_LEFT_COLUMN_WIDTH;
    const uri = getScaledImageUrl(product.featuredImage.src, imageSize, imageSize);

    return (

        <YStack
            w={imageSize}
            h={imageSize}
            bw={1}
            boc="$borderColor"
            br="$3"
            ov="hidden"
            {...props}
        >
            <ThemedImage
                source={{ uri }}
                image={product.featuredImage}
                title={product.name}
                w={imageSize}
                h={imageSize}
            />
        </YStack>

    );
};
