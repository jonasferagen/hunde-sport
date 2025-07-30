import { ThemeVariant } from '@/types';
import { getScaledImageUrl } from "@/utils/helpers";
import { LinearGradient } from '@tamagui/linear-gradient';
import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { DimensionValue } from "react-native";
import { Image, SizableText, YStack, YStackProps } from 'tamagui';

const GRADIENT_MIN_HEIGHT = 25;


export interface TileProps extends Omit<YStackProps, 'href'> {
    title: string;
    imageUrl: string;
    width?: DimensionValue;
    height?: DimensionValue;
    aspectRatio?: number;
    onPress?: () => void;
    titleNumberOfLines?: number;
    gradientMinHeight?: number;
    theme?: ThemeVariant;
    href: HrefObject;
    children?: React.ReactNode;
}

export const Tile = (props: TileProps) => {
    const {
        title,
        imageUrl,
        width = '100%',
        height,
        aspectRatio,
        onPress,
        titleNumberOfLines = 1,
        gradientMinHeight = GRADIENT_MIN_HEIGHT,
        theme = 'primary',
        href,
        children,
        ...stackProps
    } = props;

    // const themeValues = useTheme();
    const finalImageUrl = getScaledImageUrl(imageUrl, Number(width), Number(height));

    return <Link href={href} asChild>
        <YStack
            theme={theme}
            onPress={onPress}
            w={width}
            h={aspectRatio ? undefined : height || '100%'}
            br="$3"
            aspectRatio={aspectRatio}
            overflow="hidden"
            bw={1}
            boc="$borderColor"
            flex={1}
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
            <YStack flex={1} jc="flex-end">
                <LinearGradient

                    colors={["$backgroundAlpha", "$backgroundPress"]}
                    minHeight={gradientMinHeight}
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
    </Link>;
}
