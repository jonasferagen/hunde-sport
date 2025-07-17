import { SPACING } from '@/styles';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface ChipContainerProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    gap?: keyof typeof SPACING;
}

export const ChipContainer = ({ children, style, gap = 'sm' }: ChipContainerProps) => {
    return <View style={[styles.container, { gap: SPACING[gap] }, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
});
