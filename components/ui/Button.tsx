import { COLORS } from '@/styles/Colors';
import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon, ValidIcon } from './Icon';

export interface ButtonProps {
    onPress: () => void;
    title: string;
    icon?: keyof typeof ValidIcon;
};

export const Button = ({ onPress, title, icon }: ButtonProps) => {
    return (
        <Pressable onPress={onPress} style={styles.button}>
            <View style={styles.content}>
                <Text style={styles.text}>{title}</Text>
                {icon && <Icon name={icon} color="white" size={20} style={styles.icon} />}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.secondary,
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
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Button;