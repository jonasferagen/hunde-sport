import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { SizableText, ThemeName, XStack, XStackProps } from 'tamagui';

interface ChipProps extends Omit<XStackProps, 'href'> {
    title?: string;
    icon?: React.ReactNode;
    theme: ThemeName;
    href?: HrefObject;
    onPress?: () => void;
}

export const Chip = ({ title, icon, theme, href, onPress, ...rest }: ChipProps) => {
    const chipContent = (
        <XStack
            theme={theme}
            py="$1"
            px="$2"
            br="$3"
            bg="$background"
            bw={1}
            boc="$borderColorStrong"
            ai="center"
            jc="center"
            onPress={onPress}
            pressStyle={onPress ? { opacity: 0.7 } : undefined}
            {...rest}
        >
            {icon}
            {title && (
                <SizableText size="$2" numberOfLines={1}>
                    {title}
                </SizableText>
            )}
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
