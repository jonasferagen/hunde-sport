import { getScaledImageUrl } from "@/utils/helpers";
import { LinearGradient } from '@tamagui/linear-gradient';
import { Href, Link } from 'expo-router';
import React from 'react';
import { Image, SizableText, YStack, YStackProps } from 'tamagui';

const GRADIENT_MIN_HEIGHT = 25;

export interface TileProps extends YStackProps {
    title: string;
    imageUrl: string;
    href?: Href<any>;
    titleNumberOfLines?: number;
    gradientMinHeight?: number;
}

export const Tile: React.FC<TileProps> = ({
    w,
    h,
    title,
    imageUrl,
    aspectRatio = 1,
    onPress,
    titleNumberOfLines = 1,
    gradientMinHeight = GRADIENT_MIN_HEIGHT,
    href,
    children,
    ...stackProps
}) => {
    const isNumericWidth = typeof w === 'number';
    const isNumericHeight = typeof h === 'number';
    if (!isNumericWidth || !isNumericHeight) {
        throw new Error('Tile: unsupported width or height type, must be numeric');
    }

    const uri = getScaledImageUrl(imageUrl, w, h);

    const content = (
        <YStack
            w={w}
            h={aspectRatio ? undefined : h || '100%'}
            f={1}
            br={"$3"}
            boc="$borderColor"
            bw={1}
            aspectRatio={aspectRatio}
            overflow="hidden"
            onPress={onPress}
            {...stackProps}
        >
            <Image
                source={{ uri }}
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
                </LinearGradient>
            </YStack>
            {children}
        </YStack>
    );

    if (href) {
        return <Link href={href} asChild>{content}</Link>;
    }

    return content;
}
