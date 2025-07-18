import { useTheme } from '@/contexts';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/styles';
import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { CustomText, CustomTextProps } from '../text/CustomText';

interface ChipProps {
    label: string;
    onPress?: () => void;
    variant?: 'primary' | 'secondary' | 'accent' | 'default';
    style?: StyleProp<ViewStyle>;
    textProps?: CustomTextProps;
    isSelected?: boolean;
}

export const Chip = ({ label, onPress, variant = 'default', style, textProps, isSelected = false }: ChipProps) => {
    const { themeManager } = useTheme();
    const themeVariant = themeManager.getVariant(variant);
    const styles = createStyles(themeVariant);

    const chipStyle = [
        styles.chip,
        style,
    ];

    const textStyle = [
        styles.text,
        textProps?.style,
    ];

    return (
        <TouchableOpacity onPress={onPress} style={chipStyle} disabled={!onPress}>
            <CustomText style={textStyle} numberOfLines={1} ellipsizeMode="tail">
                {label}
            </CustomText>
        </TouchableOpacity>
    );
};

const createStyles = (themeVariant: any) => {


    return StyleSheet.create({
        chip: {
            backgroundColor: themeVariant.backgroundColor,
            borderColor: themeVariant.borderColor,
            borderWidth: 1,
            paddingVertical: SPACING.xs,
            paddingHorizontal: SPACING.sm,
            borderRadius: BORDER_RADIUS.sm,
            justifyContent: 'center',
            alignItems: 'center',
            outlineColor: themeVariant.outlineColor,
            outlineWidth: 1,
        },
        text: {
            color: themeVariant.text.primary,
            fontSize: FONT_SIZES.sm,
            textAlign: 'center',
        },
    });
};
