import { FONT_SIZES } from '@/styles';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomText } from '../customtext/CustomText';

export const ValidIcon = {
    addToCart: 'plus',
    removeFromCart: 'minus',
    shoppingCart: 'shopping-cart',
    menu: 'bars',
    tag: 'tag',
    emptyCart: 'trash',
    close: 'reply',
    collapse: 'chevron-up',
    expand: 'chevron-down',
    category: 'tag',
    categories: 'tags',
    home: 'home',
    checkout: 'arrow-right',
    breadcrumbSeparator: 'chevron-left',
    search: 'search',

} as const;

// Get the type of all props that FontAwesome accepts
interface IconProps extends Omit<React.ComponentProps<typeof FontAwesome>, 'name' | 'size'> {
    name: keyof typeof ValidIcon;
    badge?: number;
    size?: string;
};

export const Icon = ({ name, badge = 0, size = 'xl', ...rest }: IconProps) => {
    const fontSize = FONT_SIZES[size as keyof typeof FONT_SIZES];
    return (
        <View>
            <FontAwesome name={ValidIcon[name]} size={fontSize} {...rest} />
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
