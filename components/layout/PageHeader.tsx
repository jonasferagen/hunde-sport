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
    const { themeManager } = useTheme();
    const themeVariant = themeManager.getVariant('default');

    return (
        <View style={[styles.container, { backgroundColor: themeVariant.backgroundColor, borderBottomColor: themeVariant.borderColor }]}>
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
    },
    innerContainer: {
        gap: SPACING.sm,
    },

});
