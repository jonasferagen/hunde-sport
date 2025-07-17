import { useTheme } from '@/contexts/ThemeProvider';
import { FONT_SIZES } from '@/styles';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { Theme } from '@/types';
import { Pressable, StyleSheet, View } from 'react-native';
import { CustomText } from '../customtext/CustomText';
import { Icon, ValidIcon } from '../icon/Icon';

export interface ButtonProps {
    onPress?: () => void;
    title?: string;
    icon?: keyof typeof ValidIcon;
    variant?: 'primary' | 'secondary' | 'accent';
    size?: 'sm' | 'md' | 'lg';
};

const createVariantStyles = (theme: Theme) => ({
    primary: {
        backgroundColor: theme.colors.primary,
        color: theme.textOnColor.primary,
    },
    secondary: {
        backgroundColor: theme.colors.secondary,
        color: theme.textOnColor.secondary,
    },
    accent: {
        backgroundColor: theme.colors.accent,
        color: theme.textOnColor.accent,
    },
});

export const Button = ({ onPress, title = '', icon, variant = 'primary', size = 'md' }: ButtonProps) => {
    const { theme } = useTheme();
    const variantStyles = createVariantStyles(theme);
    const stylesForVariant = variantStyles[variant];
    const styles = createStyles(size);

    return (
        <Pressable onPress={onPress} style={[styles.button, { backgroundColor: stylesForVariant.backgroundColor }]}>
            <View style={styles.content}>
                {title && <CustomText style={[styles.text, { color: stylesForVariant.color }]}>{title}</CustomText>}
                {icon && <Icon name={icon} color={stylesForVariant.color} size={'xl'} style={styles.icon} />}
            </View>
        </Pressable>
    );
};

const createStyles = (size: 'sm' | 'md' | 'lg') => StyleSheet.create({
    button: {
        padding: SPACING[size as keyof typeof SPACING],
        borderRadius: BORDER_RADIUS[size as keyof typeof BORDER_RADIUS],
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {

    },
    text: {
        fontSize: FONT_SIZES[size as keyof typeof FONT_SIZES],
        fontWeight: '600',
    },
});

export default Button;