import { ThemeVariant } from '@/types';
import { getScaledImageUrl, rgba } from "@/utils/helpers";
import { LinearGradient } from 'expo-linear-gradient';
import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { DimensionValue } from "react-native";
import { Image, SizableText, YStack, YStackProps, styled, useTheme } from 'tamagui';


const GRADIENT_MIN_HEIGHT = 25;

const StyledLinearGradient = styled(LinearGradient, {
    name: 'StyledLinearGradient',
    minHeight: GRADIENT_MIN_HEIGHT,
    padding: '$2',
    jc: 'center',
});

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

    const themeValues = useTheme();
    const finalImageUrl = getScaledImageUrl(imageUrl, Number(width), Number(height));

    return <Link href={href} asChild>
        <YStack
            theme={theme}
            onPress={onPress}
            width={width}
            height={aspectRatio ? undefined : height || '100%'}
            aspectRatio={aspectRatio}
            borderRadius="$3"
            overflow="hidden"
            borderWidth={1}
            borderColor="$borderColor"
            flex={1}
            {...stackProps}
        >
            <Image
                source={{ uri: finalImageUrl }}
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                objectFit="cover"
            />
            <YStack flex={1} jc="flex-end">
                <StyledLinearGradient
                    colors={[rgba(themeValues.background.val, 0.7), rgba(themeValues.background.val, 1)]}
                    minHeight={gradientMinHeight}
                >
                    <SizableText
                        fontSize="$1"
                        color="$color"
                        textAlign="center"
                        numberOfLines={titleNumberOfLines}
                    >
                        {title}
                    </SizableText>
                </StyledLinearGradient>
            </YStack>
            {children}
        </YStack>
    </Link>;
}
