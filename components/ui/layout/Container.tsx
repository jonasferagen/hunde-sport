import { SPACING } from '@/styles';
import React, { JSX } from 'react';
import { FlexAlignType, Pressable, StyleProp, View, ViewStyle } from 'react-native';

export interface ContainerProps {
    children: React.ReactNode;
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: FlexAlignType;
    style?: StyleProp<ViewStyle>;
    debug?: string;
    flex?: number;
    onPress?: () => void;
    gap?: string;
}

export const Container = ({ children, justifyContent, alignItems, style, debug, onPress, flex, gap = 'sm' }: ContainerProps): JSX.Element => {
    const dynamicStyles: ViewStyle = {
        justifyContent,
        alignItems,
        flex,
        gap: SPACING[gap as keyof typeof SPACING],
    };

    const debugStyle: ViewStyle = debug ? { borderWidth: 1, borderColor: debug } : {};

    const finalStyle = [dynamicStyles, debugStyle, style];

    if (onPress) {
        return (
            <Pressable onPress={onPress} style={finalStyle}>
                {children}
            </Pressable>
        );
    }

    return <View style={finalStyle}>{children}</View>;
};
