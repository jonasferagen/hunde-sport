import { useTheme } from '@/contexts/ThemeProvider';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, ValidIcon } from '../icon/Icon';
import { CustomText } from '../text/CustomText';

export interface ButtonProps {
    onPress?: () => void;
    title?: string;
    icon?: keyof typeof ValidIcon;
    variant?: 'primary' | 'secondary' | 'accent' | 'default';
    size?: 'sm' | 'md' | 'lg';
};


export const Button = ({ onPress, title = undefined, icon, variant = 'primary', size = 'md' }: ButtonProps) => {
    const { themeManager } = useTheme();
    const themeVariant = themeManager.getVariant(variant);
    const styles = createStyles(size);

    return (
        <Pressable onPress={onPress} style={[styles.button, { backgroundColor: themeVariant.backgroundColor, borderColor: themeVariant.borderColor }]}>
            <View style={styles.content}>
                {title && <CustomText color={themeVariant.text.primary} style={[{ marginRight: SPACING.sm }]}>{title}</CustomText>}
                {icon && <Icon name={icon} color={themeVariant.text.primary} size={'xl'} />}
            </View>
        </Pressable>
    );
};

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