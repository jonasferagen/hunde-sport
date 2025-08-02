import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { SizableText, ThemeName, XStack, XStackProps } from 'tamagui';

interface ChipProps extends Omit<XStackProps, 'href'> {
    title: string;
    theme: ThemeName;
    href?: HrefObject;
    onPress?: () => void;
}

export const Chip = ({ title, theme, href, onPress, ...rest }: ChipProps) => {
    const chipContent = (
        <XStack
            theme={theme}
            py="$1"
            px="$2"
            br="$3"
            bg="$background"
            bw={1}
            ai="center"
            jc="center"
            onPress={onPress}
            pressStyle={onPress ? { opacity: 0.7 } : undefined}
            {...rest}
        >
            <SizableText size="$2" numberOfLines={1}>
                {title}
            </SizableText>
        </XStack>
    );

    if (href) {
        return (
            <Link replace href={href} asChild>
                {chipContent}
            </Link>
        );
    }

    return chipContent;
};
