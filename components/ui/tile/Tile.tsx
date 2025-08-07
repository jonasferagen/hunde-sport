import { Image } from '@/models/Image';
import { getScaledImageUrl } from '@/utils/helpers';
import { LinearGradient } from '@tamagui/linear-gradient';
import React from 'react';
import { SizableText, YStack, YStackProps } from 'tamagui';
import { FadeInImage } from '../image/FadeInImage';

const GRADIENT_MIN_HEIGHT = 25;

export interface TileProps extends YStackProps {
    title: string;
    subtitle?: string;
    image: Image;
    aspectRatio?: number | string;
    titleNumberOfLines?: number;
    gradientMinHeight?: number;
    children?: React.ReactNode;
}

export const Tile: React.FC<TileProps> = ({
    w,
    h,
    title,
    subtitle,
    image,
    titleNumberOfLines = 1,
    gradientMinHeight = GRADIENT_MIN_HEIGHT,
    children,
    ...stackProps
}) => {


    const uri = getScaledImageUrl(image.src, Number(w), Number(h), 'cover');

    return (
        <YStack
            w={w}
            h={h}
            f={1}
            br="$3"
            boc="$borderColorStrong"
            bw={1}
            overflow="hidden"
            {...stackProps}
        >

            <FadeInImage
                aria-label={title}
                source={{ uri }}
                f={1}
                pos="absolute"
                t={0}
                l={0}
                r={0}
                b={0}
                h={h}
                w={w}
                objectFit="cover"
            />

            <YStack f={1} jc="flex-end">
                <LinearGradient
                    colors={["$backgroundAlpha", "$backgroundStrong"]}
                    boc="$borderColorStrong"
                    btw={1}
                    mih={gradientMinHeight}
                    p="$2"
                >
                    <SizableText
                        fos="$1"
                        col="$color"
                        ta="center"
                        numberOfLines={titleNumberOfLines}
                    >
                        {title}
                    </SizableText>
                    {subtitle && (
                        <SizableText
                            fos="$2"
                            col="$color"
                            ta="center"
                            numberOfLines={1}
                        >
                            {subtitle}
                        </SizableText>
                    )}
                </LinearGradient>
            </YStack>
            {children}
        </YStack>
    );

}
