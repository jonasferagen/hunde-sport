import React, { JSX } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { ContainerProps } from './types';

export const Container = ({ children, justifyContent, alignItems, style, debug, onPress }: ContainerProps): JSX.Element => {
    const dynamicStyles: ViewStyle = {
        justifyContent,
        alignItems,
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
