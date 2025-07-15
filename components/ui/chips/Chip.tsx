import { useTheme } from '@/hooks/Theme/ThemeProvider';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/styles';
import { Theme } from '@/styles/Colors';
import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { CustomText, CustomTextProps } from '../customtext/CustomText';

interface ChipProps {
    label: string;
    onPress?: () => void;
    variant?: 'primary' | 'secondary' | 'accent';
    style?: StyleProp<ViewStyle>;
    textProps?: CustomTextProps;
}

export const Chip = ({ label, onPress, variant = 'secondary', style, textProps }: ChipProps) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const chipStyle = [
        styles.chip,
        styles[variant],
        style,
    ];

    const textStyle = [
        styles.chipText,
        styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles]
    ];

    return (
        <TouchableOpacity onPress={onPress} style={chipStyle} disabled={!onPress}>
            <CustomText style={textStyle} numberOfLines={1} ellipsizeMode="tail" {...textProps}>
                {label}
            </CustomText>
        </TouchableOpacity>
    );
};

const createStyles = (theme: Theme) => StyleSheet.create({
    chip: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chipText: {
        fontSize: FONT_SIZES.sm,
        textAlign: 'center',
    },
    primary: {
        backgroundColor: theme.colors.primary,
    },
    secondary: {
        backgroundColor: theme.colors.secondary,
    },
    accent: {
        backgroundColor: theme.colors.accent,
    },
    textPrimary: {
        color: theme.textOnColor.primary,
    },
    textSecondary: {
        color: theme.textOnColor.secondary,
    },
    textAccent: {
        color: theme.textOnColor.accent,
    },
});
