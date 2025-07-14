import { FONT_SIZES } from '@/styles';
import { COLORS } from '@/styles/Colors';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon, ValidIcon } from '../Icon';

export interface ButtonProps {
    onPress: () => void;
    title: string;
    icon?: keyof typeof ValidIcon;
    variant?: 'primary' | 'secondary' | 'accent';
};

const variantStyles = {
    primary: {
        backgroundColor: COLORS.primary,
        color: COLORS.textOnPrimary,
    },
    secondary: {
        backgroundColor: COLORS.secondary,
        color: COLORS.textOnSecondary,
    },
    accent: {
        backgroundColor: COLORS.accent,
        color: COLORS.textOnAccent,
    },
};

export const Button = ({ onPress, title, icon, variant = 'primary' }: ButtonProps) => {
    const stylesForVariant = variantStyles[variant];

    return (
        <Pressable onPress={onPress} style={[styles.button, { backgroundColor: stylesForVariant.backgroundColor }]}>
            <View style={styles.content}>
                <Text style={[styles.text, { color: stylesForVariant.color }]}>{title}</Text>
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