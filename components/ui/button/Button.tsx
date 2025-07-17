import { useTheme } from '@/contexts/ThemeProvider';
import { FONT_SIZES } from '@/styles';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, ValidIcon } from '../icon/Icon';
import { CustomText } from '../text/CustomText';

export interface ButtonProps {
    onPress?: () => void;
    title?: string;
    icon?: keyof typeof ValidIcon;
    variant?: 'primary' | 'secondary' | 'accent';
    size?: 'sm' | 'md' | 'lg';
};


export const Button = ({ onPress, title = '', icon, variant = 'primary', size = 'md' }: ButtonProps) => {
    const { _theme } = useTheme();
    const _themeVariant = _theme[variant];
    const styles = createStyles(size);

    return (
        <Pressable onPress={onPress} style={[styles.button, { backgroundColor: _themeVariant.backgroundColor, borderColor: _themeVariant.borderColor }]}>
            <View style={styles.content}>
                {title && <CustomText style={[styles.text, { color: _themeVariant.color, marginRight: SPACING.sm }]}>{title}</CustomText>}
                {icon && <Icon name={icon} color={_themeVariant.color} size={'xl'} style={styles.icon} />}
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
        justifyContent: 'space-between',
        width: '100%'
    },
    icon: {

    },
    text: {
        fontSize: FONT_SIZES[size as keyof typeof FONT_SIZES],
        fontWeight: '600',
    },
});

export default Button;