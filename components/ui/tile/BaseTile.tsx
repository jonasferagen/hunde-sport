import { rgba } from "@/utils/helpers";
import { LinearGradient } from 'expo-linear-gradient';
import { Href, Link } from "expo-router";
import React from 'react';
import { DimensionValue } from "react-native";
import { GetProps, Image, Text, YStack, styled, useTheme } from 'tamagui';

const StyledLinearGradient = styled(LinearGradient, {
    name: 'StyledLinearGradient',
    minHeight: 40,
    padding: '$2',
    justifyContent: 'center',
});

// Define the type for our variants. Export it so other components can use it.
export type ThemeVariant = 'primary' | 'secondary' | 'accent' | 'default';

export interface BaseTileProps extends Omit<GetProps<typeof YStack>, 'name'> {
    name: string;
    imageUrl: string;
    href?: Href;
    width?: DimensionValue;
    height?: DimensionValue;
    aspectRatio?: number;
    onPress?: () => void;
    nameNumberOfLines?: number;
    gradientMinHeight?: number;
    themeVariant?: ThemeVariant;
}

export const BaseTile = (props: BaseTileProps) => {
    const {
        name,
        imageUrl,
        href,
        width = '100%',
        height,
        aspectRatio,
        onPress,
        nameNumberOfLines = 1,
        gradientMinHeight = 40,
        themeVariant = 'default',
        ...stackProps
    } = props;

    const theme = useTheme();

    // Define colors inside the component to access the theme hook
    const themeColors: Record<ThemeVariant, { bg: string, text: string }> = {
        primary: { bg: theme.primary?.val ?? theme.background.val, text: theme.primaryText?.val ?? theme.color.val },
        secondary: { bg: theme.secondary?.val ?? theme.background.val, text: theme.secondaryText?.val ?? theme.color.val },
        accent: { bg: theme.accent?.val ?? theme.background.val, text: theme.accentText?.val ?? theme.color.val },
        default: { bg: theme.background.val, text: theme.color.val },
    };

    const selectedTheme = themeColors[themeVariant];

    const content = (
        <YStack
            onPress={onPress}
            width={width}
            height={aspectRatio ? undefined : height || '100%'}
            aspectRatio={aspectRatio}
            borderRadius="$3"
            overflow="hidden"
            borderWidth={1}
            borderColor="$defaultBorder"
            flex={1}
            {...stackProps}
        >
            <Image
                source={{ uri: imageUrl }}
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                resizeMode="cover"
            />
            <YStack flex={1} justifyContent="flex-end">
                <StyledLinearGradient
                    colors={[rgba(selectedTheme.bg, 0.7), rgba(selectedTheme.bg, 1)]}
                    minHeight={gradientMinHeight}
                >
                    <Text
                        fontSize={14}
                        color={selectedTheme.text}
                        textAlign="center"
                        numberOfLines={nameNumberOfLines}
                    >
                        {name}
                    </Text>
                </StyledLinearGradient>
            </YStack>
        </YStack>
    );

    if (href) {
        return <Link href={href} asChild>{content}</Link>;
    }

    return content;
}
