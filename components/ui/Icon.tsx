import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

} as const;

// Get the type of all props that FontAwesome accepts
type IconProps = Omit<React.ComponentProps<typeof FontAwesome>, 'name'> & {
    name: keyof typeof ValidIcon;
    badge?: number;
};


export const Icon = ({ name, badge = 0, ...rest }: IconProps) => {

    return (
        <View>
            <FontAwesome name={ValidIcon[name]} {...rest} />
            {badge > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badge}</Text>
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
