import { useTheme } from '@/contexts/ThemeProvider';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, ValidIcon } from '../icon/Icon';
import { CustomText } from '../text/CustomText';

export interface ButtonProps {
    onPress?: () => void;
    title?: string;
    icon?: keyof typeof ValidIcon;
    variant?: 'primary' | 'secondary' | 'accent' | 'default';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
};


export const Button = React.forwardRef<View, ButtonProps>(({ onPress, title = undefined, icon, variant = 'primary', size = 'md', disabled = false }, ref) => {
    const { themeManager } = useTheme();

    const themeVariant = themeManager.getVariant(variant);
    const styles = createStyles(size);
    let { backgroundColor, borderColor, text } = themeVariant;

    if (disabled) {
        backgroundColor = themeManager.getVariant('default').backgroundColor;
        borderColor = themeManager.getVariant('default').borderColor;
    }

    return (
        <Pressable ref={ref} onPress={onPress} style={[styles.button, { backgroundColor, borderColor }]} disabled={disabled}>
            <View style={styles.content}>
                {title && <CustomText color={text.primary} style={[{ marginRight: SPACING.sm }]}>{title}</CustomText>}
                {icon && <Icon name={icon} color={text.primary} size={'xl'} />}
            </View>
        </Pressable>
    );
});

const createStyles = (size: 'sm' | 'md' | 'lg') => StyleSheet.create({
    button: {
        padding: SPACING[size],
        borderRadius: BORDER_RADIUS[size],
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },

});

export default Button;