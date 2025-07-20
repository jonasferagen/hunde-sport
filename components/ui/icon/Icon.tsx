import { useThemeContext } from '@/contexts';
import { FONT_SIZES } from '@/styles';
import { IStyleVariant } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomText } from '../text/CustomText';

export const ValidIcon = {
    add: 'add-outline',
    remove: 'remove-outline',
    addToCart: 'cart-outline',
    shoppingCart: 'cart-outline',
    menu: 'menu-outline',
    tag: 'pricetag-outline',
    emptyCart: 'trash-outline',
    close: 'close-outline',
    collapse: 'chevron-up-outline',
    expand: 'chevron-down-outline',
    category: 'pricetag-outline',
    categories: 'pricetags-outline',
    home: 'home-outline',
    next: 'arrow-forward-outline',
    prev: 'arrow-back-outline',
    breadcrumbSeparator: 'chevron-forward-outline',
    search: 'search-outline',
    dot: 'ellipse-outline',
    link: 'link-outline'
} as const;

// Get the type of all props that Ionicons accepts
interface IconProps extends Omit<React.ComponentProps<typeof Ionicons>, 'name' | 'size' | 'color'> {
    name: string;
    badge?: number;
    size?: string;
    color?: string;
};

export const Icon = ({ name, badge = 0, size = 'xl', color, ...rest }: IconProps) => {

    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('primary');
    const finalColor = color || theme.text.primary;

    const alert = themeManager.getAlert('info');
    const styles = createStyles(alert);

    const fontSize = FONT_SIZES[size as keyof typeof FONT_SIZES];
    const fontName = ValidIcon[name as keyof typeof ValidIcon];

    if (fontName === undefined) {
        console.error(`Invalid icon name: ${name}`);
        return null;
    }

    return (
        <View>
            <Ionicons name={fontName} size={fontSize} color={finalColor} {...rest} />
            {badge > 0 && (
                <View style={styles.badge}>
                    <CustomText style={styles.badgeText}>{badge}</CustomText>
                </View>
            )}
        </View>
    );
};

const createStyles = (alert: IStyleVariant) => StyleSheet.create({
    badge: {
        position: 'absolute',
        right: -10,
        top: -5,
        backgroundColor: alert.backgroundColor,
        borderRadius: 10,
        width: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: alert.text.primary,
        fontSize: 10,
        fontWeight: 'bold',
    },
});
