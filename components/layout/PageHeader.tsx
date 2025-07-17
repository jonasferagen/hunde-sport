import { useTheme } from '@/contexts';
import { SPACING } from '@/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Heading } from '../ui';

interface PageHeaderProps {
    title?: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
            <View style={styles.innerContainer}>
                <Heading title={title} />
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

});
