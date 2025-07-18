import { FONT_SIZES } from '@/styles';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomText } from '../text/CustomText';

export const ValidIcon = {
    add: 'plus',
    remove: 'minus',
    addToCart: 'shopping-cart',
    shoppingCart: 'shopping-cart',
    menu: 'bars',
    tag: 'tag',
    emptyCart: 'trash',
    close: 'times',
    collapse: 'chevron-up',
    expand: 'chevron-down',
    category: 'tag',
    categories: 'tags',
    home: 'home',
    next: 'arrow-right',
    prev: 'arrow-left',
    breadcrumbSeparator: 'chevron-left',
    search: 'search',

} as const;

// Get the type of all props that FontAwesome accepts
interface IconProps extends Omit<React.ComponentProps<typeof FontAwesome>, 'name' | 'size' | 'color'> {
    name: string;
    badge?: number;
    size?: string;
    color?: string;
};

export const Icon = ({ name, badge = 0, size = 'xl', color = 'black', ...rest }: IconProps) => {
    const fontSize = FONT_SIZES[size as keyof typeof FONT_SIZES];
    const fontName = ValidIcon[name as keyof typeof ValidIcon];

    if (fontName === undefined) {
        console.error(`Invalid icon name: ${name}`);
        return null;
    }

    return (
        <View>
            <FontAwesome name={fontName} size={fontSize} color={color} {...rest} />
            {badge > 0 && (
                <View style={styles.badge}>
                    <CustomText style={styles.badgeText}>{badge}</CustomText>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        right: -10,
        top: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
