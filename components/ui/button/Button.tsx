import { useTheme } from '@/contexts/ThemeProvider';
import { FONT_SIZES } from '@/styles';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { Theme } from '@/types';
import { Pressable, StyleSheet, View } from 'react-native';
import { CustomText } from '../customtext/CustomText';
import { Icon, ValidIcon } from '../icon/Icon';

export interface ButtonProps {
    onPress?: () => void;
    title: string;
    icon?: keyof typeof ValidIcon;
    variant?: 'primary' | 'secondary' | 'accent';
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

export const Button = ({ onPress, title, icon, variant = 'primary' }: ButtonProps) => {
    const { theme } = useTheme();
    const variantStyles = createVariantStyles(theme);
    const stylesForVariant = variantStyles[variant];

    return (
        <Pressable onPress={onPress} style={[styles.button, { backgroundColor: stylesForVariant.backgroundColor }]}>
            <View style={styles.content}>
                <CustomText style={[styles.text, { color: stylesForVariant.color }]}>{title}</CustomText>
                {icon && <Icon name={icon} color={stylesForVariant.color} size={'xl'} style={styles.icon} />}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: SPACING.md,
    },
    text: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
    },
});

export default Button;