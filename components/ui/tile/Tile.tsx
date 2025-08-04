import { LinearGradient } from '@tamagui/linear-gradient';
import React from 'react';
import { Image, SizableText, YStack, YStackProps } from 'tamagui';

const GRADIENT_MIN_HEIGHT = 25;

export interface TileProps extends YStackProps {
    title: string;
    subtitle?: string;
    imageUrl?: string;
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
    imageUrl,
    aspectRatio = 1,
    titleNumberOfLines = 1,
    gradientMinHeight = GRADIENT_MIN_HEIGHT,
    children,
    ...stackProps
}) => {

    const content = (
        <YStack
            w={w}
            h={h}
            f={1}
            br={"$3"}
            boc="$borderColor"
            bw={1}
            aspectRatio={aspectRatio}
            overflow="hidden"
            {...stackProps}
        >

            <Image
                source={{ uri: imageUrl }}
                pos="absolute"
                t={0}
                l={0}
                r={0}
                b={0}
                objectFit="cover"
            />

            <YStack flex={1} justifyContent="flex-end">
                <LinearGradient
                    colors={["$backgroundAlpha", "$backgroundPress"]}
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

    return content;
}
