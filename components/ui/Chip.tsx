import { COLORS } from '@/styles/Colors';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';
import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface ChipProps {
    label: string;
    onPress?: () => void;
    variant?: 'primary' | 'secondary' | 'accent';
    style?: StyleProp<ViewStyle>;
}

export const Chip = ({ label, onPress, variant = 'secondary', style }: ChipProps) => {
    const chipStyle = [
        styles.chip,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'accent' && styles.accent,
        style,
    ];

    const textStyle = [
        styles.chipText,
        variant === 'secondary' ? styles.darkText : styles.lightText,
    ];

    return (
        <TouchableOpacity onPress={onPress} style={chipStyle} disabled={!onPress}>
            <Text style={textStyle} numberOfLines={1} ellipsizeMode="tail">
                {label}
            </Text>
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
    primary: {
        backgroundColor: COLORS.primary,
    },
    secondary: {
        backgroundColor: COLORS.secondary,
    },
    accent: {
        backgroundColor: COLORS.accent,
    },
    chipText: {
        fontSize: FONT_SIZES.sm,
        textAlign: 'center',
    },
    lightText: {
        color: COLORS.textOnPrimary, // Or a generic light text color
    },
    darkText: {
        color: COLORS.textOnSecondary, // Or a generic dark text color
    },
});

