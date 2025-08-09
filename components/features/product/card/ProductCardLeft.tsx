import { ThemedImage } from '@/components/ui/ThemedImage';
import { useProductContext } from '@/contexts';
import { getScaledImageUrl } from '@/lib/helpers';
import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { YStack, YStackProps } from 'tamagui';

export const PRODUCT_CARD_LEFT_COLUMN_WIDTH = 80;

interface ProductCardImageProps {
    href: HrefObject;
    props?: YStackProps;
}

export const ProductCardLeft = ({ href, props }: ProductCardImageProps) => {
    const { purchasable } = useProductContext();
    const { image, titles } = purchasable;

    const imageSize = PRODUCT_CARD_LEFT_COLUMN_WIDTH;
    const uri = getScaledImageUrl(image.src, imageSize, imageSize);

    return (
        <Link href={href}>
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
                    title={titles.title}
                    w={imageSize}
                    h={imageSize}
                />
            </YStack>
        </Link>
    );
};
