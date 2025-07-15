import { useTheme } from '@/contexts/ThemeProvider';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/styles';
import { Theme } from '@/styles/Theme';
import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { CustomText, CustomTextProps } from '../customtext/CustomText';

interface ChipProps {
    label: string;
    onPress?: () => void;
    variant?: 'primary' | 'secondary' | 'accent' | 'default';
    style?: StyleProp<ViewStyle>;
    textProps?: CustomTextProps;
}

export const Chip = ({ label, onPress, variant = 'default', style, textProps }: ChipProps) => {
    const { theme } = useTheme();
    const styles = createStyles(theme, variant);

    const chipStyle = [
        styles.chip,
        style,
    ];

    const textStyle = [
        styles.text,
        textProps,
    ];

    return (
        <TouchableOpacity onPress={onPress} style={chipStyle} disabled={!onPress}>
            <CustomText style={textStyle} numberOfLines={1} ellipsizeMode="tail">
                {label}
            </CustomText>
        </TouchableOpacity>
    );
};

const createStyles = (theme: Theme, variant: ChipProps['variant']) => {
    const backgroundColor = variant === 'default' ? theme.colors.card : theme.colors[variant!];
    const textColor = variant === 'default' ? theme.colors.text : theme.textOnColor[variant!];

    return StyleSheet.create({
        chip: {
            backgroundColor: backgroundColor,
            paddingVertical: SPACING.xs,
            paddingHorizontal: SPACING.sm,
            borderRadius: BORDER_RADIUS.sm,
            justifyContent: 'center',
            alignItems: 'center',
        },
        text: {
            color: textColor,
            fontSize: FONT_SIZES.sm,
            textAlign: 'center',
        },
    });
};
