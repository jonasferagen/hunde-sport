import { useThemeContext } from '@/contexts';
import { SPACING } from '@/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { H4 } from 'tamagui';

interface PageHeaderProps {
    title?: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
    const { themeManager } = useThemeContext();
    const themeVariant = themeManager.getVariant('card');
    const { backgroundColor, borderColor } = themeVariant;
    return (
        <View style={[styles.container, { backgroundColor, borderColor }]}>
            <View style={styles.titleContainer}>
                <H4>{title}</H4>
            </View>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.md,
        borderBottomWidth: 1,
    },
    titleContainer: {
        gap: SPACING.md,
    },
});
