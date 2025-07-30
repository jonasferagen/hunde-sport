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
    title,
    imageUrl,
    width = '100%',
    height,
    aspectRatio,
    onPress,
    titleNumberOfLines = 1,
    gradientMinHeight = GRADIENT_MIN_HEIGHT,
    href,
    children,
    ...stackProps
}) => {

    const isNumericWidth = typeof width === 'number';
    const isNumericHeight = typeof height === 'number';

    const finalImageUrl = (isNumericWidth && isNumericHeight) ? getScaledImageUrl(imageUrl, width, height) : imageUrl;

    const content = (
        <YStack

            onPress={onPress}
            w={width}
            h={aspectRatio ? undefined : height || '100%'}
            f={1}
            br={"$3"}
            boc="$borderColor"
            bw={1}
            aspectRatio={aspectRatio}
            overflow="hidden"
            {...stackProps}
        >
            <Image
                source={{ uri: finalImageUrl }}
                position="absolute"
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
                        fontSize="$1"
                        color="$color"
                        textAlign="center"
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
