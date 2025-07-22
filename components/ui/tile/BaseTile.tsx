import { rgba } from "@/utils/helpers";
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { DimensionValue, StyleProp, ViewStyle } from "react-native";
import { Image, Text, YStack, styled, useTheme } from 'tamagui';

const StyledLinearGradient = styled(LinearGradient, {
    name: 'StyledLinearGradient',
    minHeight: 40,
    padding: '$2',
    justifyContent: 'center',
});

export interface BaseTileProps {
    name: string;
    imageUrl: string;
    topRightComponent?: React.ReactNode;
    width?: DimensionValue;
    height?: DimensionValue;
    aspectRatio?: number;
    onPress?: () => void;
    nameNumberOfLines?: number;
    gradientMinHeight?: number;
    themeVariant?: 'primary' | 'secondary' | 'accent' | 'default' | 'card';
    textSize?: string;
    textColor?: string;
    style?: StyleProp<ViewStyle>;
}

export const BaseTile = ({
    name,
    imageUrl,
    topRightComponent,
    width = '100%',
    height,
    aspectRatio,
    onPress,
    nameNumberOfLines = 1,
    gradientMinHeight = 40,
    themeVariant = 'card',
    textSize = 'sm',
    style
}: BaseTileProps) => {
    const theme = useTheme();

    const themeColors = {
        primary: { bg: theme.primary?.val ?? theme.background.val, text: theme.primaryText?.val ?? theme.color.val },
        secondary: { bg: theme.secondary?.val ?? theme.background.val, text: theme.secondaryText?.val ?? theme.color.val },
        accent: { bg: theme.accent?.val ?? theme.background.val, text: theme.accentText?.val ?? theme.color.val },
        card: { bg: theme.background.val, text: theme.color.val },
        default: { bg: theme.background.val, text: theme.color.val },
    };

    const selectedTheme = themeColors[themeVariant];

    return (
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
            style={style}
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
            {topRightComponent && (
                <YStack
                    position="absolute"
                    top="$2"
                    right="$2"
                    alignSelf="flex-end"
                    opacity={0.9}
                    borderRadius="$3"
                    paddingVertical="$1"
                    paddingHorizontal="$2"
                >
                    {topRightComponent}
                </YStack>
            )}
            <YStack flex={1} justifyContent="flex-end">
                <StyledLinearGradient
                    colors={[rgba(selectedTheme.bg, 0.7), rgba(selectedTheme.bg, 1)]}
                    minHeight={gradientMinHeight}
                >
                    <Text
                        fontSize={textSize === 'sm' ? '$2' : '$3'}
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
}
