import { useTheme } from '@/contexts';
import { FONT_FAMILY, FONT_SIZES, SPACING } from '@/styles';
import { Theme } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import React, { JSX } from 'react';
import { StyleSheet } from 'react-native';
import { CustomText } from '../ui';

interface HeaderProps {
    title: string;
}

export const Header = ({ title }: HeaderProps): JSX.Element => {
    const { theme } = useTheme();

    const styles = createHeaderStyles(theme);

    return (
        <LinearGradient
            colors={theme.gradients.primary}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <CustomText style={styles.title}>{title}</CustomText>
        </LinearGradient>
    );
};

const createHeaderStyles = (theme: Theme) => StyleSheet.create({
    container: {
        paddingVertical: SPACING.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: theme.colors.text,
        fontFamily: FONT_FAMILY.bold,
        fontSize: FONT_SIZES.lg,
    },
});
