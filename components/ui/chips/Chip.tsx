import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/styles';
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
    const chipStyle = [
        styles.chip,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'accent' && styles.accent,
        style,
    ];

    const textStyle = [
        styles.chipText,
        variant === 'primary' && styles.textPrimary,
        variant === 'secondary' && styles.textSecondary,
        variant === 'accent' && styles.textAccent,
    ];

    return (
        <TouchableOpacity onPress={onPress} style={chipStyle} disabled={!onPress}>
            <CustomText style={textStyle} numberOfLines={1} ellipsizeMode="tail" {...textProps}>
                {label}
            </CustomText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
        backgroundColor: COLORS.darkPrimary,
    },
    secondary: {
        backgroundColor: COLORS.darkSecondary,
    },
    accent: {
        backgroundColor: COLORS.darkAccent,
    },
    textPrimary: {
        color: COLORS.white, // Or a generic light text color
    },
    textSecondary: {
        color: COLORS.white, // Or a generic dark text color
    },
    textAccent: {
        color: COLORS.white, // Or a generic dark text color
    },
});
