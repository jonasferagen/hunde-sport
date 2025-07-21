import { useThemeContext } from '@/contexts';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/styles';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Row } from '../layout';
import { CustomText, CustomTextProps } from '../text/CustomText';

interface ChipProps {
    label: string;
    onPress?: () => void;
    variant?: 'primary' | 'secondary' | 'accent' | 'default';
    style?: StyleProp<ViewStyle>;
    textProps?: CustomTextProps;
    isSelected?: boolean;
    icon?: string;
    disabled?: boolean;
}

export const Chip = ({
    label,
    onPress,
    variant = 'default',
    style,
    textProps,
    icon,
    isSelected = false,
    disabled = false
}: ChipProps) => {
    const { themeManager } = useThemeContext();
    const themeVariant = themeManager.getVariant(variant);
    const styles = createStyles(themeVariant, disabled);

    const chipStyle = [
        styles.chip,
        style,
    ];

    const textStyle = [
        styles.text,
        textProps?.style,
    ];

    return (
        <Row onPress={disabled ? undefined : onPress} style={[chipStyle, { gap: 5 }]} alignItems="center" justifyContent="space-between">
            <CustomText style={textStyle} numberOfLines={1} ellipsizeMode="tail">
                {label}
            </CustomText>

        </Row>
    );
};

const createStyles = (themeVariant: any, disabled: boolean) => {


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
            opacity: disabled ? 0.5 : 1,
        },

        text: {
            color: themeVariant.text.primary,
            fontSize: FONT_SIZES.sm,
            textAlign: 'center',
            textDecorationLine: disabled ? 'line-through' : 'none',
        },
    });
};
