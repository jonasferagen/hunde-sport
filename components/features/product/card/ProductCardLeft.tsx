import { ThemedImage } from '@/components/ui/ThemedImage';
import { getScaledImageUrl } from '@/lib/helpers';
import { Purchasable } from '@/types';
import { HrefObject } from 'expo-router';
import React from 'react';
import { YStack, YStackProps } from 'tamagui';

export const PRODUCT_CARD_LEFT_COLUMN_WIDTH = 80;

interface ProductCardImageProps {
    href: HrefObject;
    purchasable: Purchasable;
    props?: YStackProps;
}

export const ProductCardLeft = ({ href, purchasable, props }: ProductCardImageProps) => {
    const { image, titles } = purchasable;

    const imageSize = PRODUCT_CARD_LEFT_COLUMN_WIDTH;
    const uri = getScaledImageUrl(image.src, imageSize, imageSize);

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
                image={image}
                title={titles.full}
                w={imageSize}
                h={imageSize}
            />
        </YStack>

    );
};
