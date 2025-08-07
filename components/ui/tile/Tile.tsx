import { Image } from '@/models/Image';
import { getScaledImageUrl } from '@/utils/helpers';
import React from 'react';
import { SizableText, YStack, YStackProps } from 'tamagui';
import { FadeInImage } from '../image/FadeInImage';
import { ThemedLinearGradient } from '../ThemedLinearGradient';

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
                h={h}
                w={w}
                pos="absolute"
                objectFit="cover"
            />

            <YStack boc="black" bw={1} f={1}>
                {children}
            </YStack>
            <ThemedLinearGradient
                pos="relative"
                fullscreen
                mah="30%"
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
            </ThemedLinearGradient>

        </YStack>
    );
}


interface TileBadgeProps extends YStackProps {
    children: React.ReactNode;

}

export const TileBadge = ({ children, ...props }: TileBadgeProps): React.JSX.Element => {

    return (
        <YStack
            pos="absolute"
            t="$2"
            r="$2"
            bc="$backgroundAlpha"
            bw={1}
            boc="$borderColorStrong"
            px="$1"
            br="$3"
            {...props}
        >
            {children}
        </YStack>
    );
};
