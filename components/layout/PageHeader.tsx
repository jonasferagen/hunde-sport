import { useTheme } from '@/contexts';
import { FONT_SIZES, SPACING } from '@/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomText } from '../ui';

interface PageHeaderProps {
    title?: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
            <View style={styles.innerContainer}>
                {title && <CustomText style={[styles.title, { color: theme.colors.text }]}>{title}</CustomText>}
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0', // A light separator line
    },
    innerContainer: {
        gap: SPACING.sm,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        marginBottom: SPACING.md,
    },
});
