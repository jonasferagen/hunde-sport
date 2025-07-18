import React, { JSX } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Container } from './Container';
import { ContainerProps } from './types';

interface RowProps extends ContainerProps {
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    debug?: string;
}

export const Row = ({ children, justifyContent, alignItems, style, debug, ...props }: RowProps): JSX.Element => {
    const dynamicStyles: ViewStyle = {
        justifyContent,
        alignItems,
    };

    const debugStyle: ViewStyle = debug ? { borderWidth: 1, borderColor: debug } : {};

    return <Container {...props} style={[styles.container, dynamicStyles, debugStyle, style]}>{children}</Container>;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
});