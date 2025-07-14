import { useShoppingCart } from '@/hooks/ShoppingCart/ShoppingCartProvider';
import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Heading, Icon } from '../ui/';

export const TopMenu = React.memo(() => {

    const DrawerToggleButton = () => {
        const navigation = useNavigation<DrawerNavigationProp<{}>>();
        return (
            <Pressable onPress={() => navigation.toggleDrawer()}>
                <Icon name="menu" size={24} style={styles.content} />
            </Pressable>
        );
    };

    const TitleButton = () => {
        const router = useRouter();
        return (
            <Pressable onPress={() => router.push('/')}>
                <Heading title="hunde-sport.no" size="lg" style={styles.content} />
            </Pressable >
        );
    };

    const ShoppingCartButton = () => {
        const { cartItemCount } = useShoppingCart();
        const router = useRouter();
        console.log("shoppingCartButton rendered" + cartItemCount);
        return (
            <Pressable onPress={() => router.push('/shoppingCart')}>
                <Icon name="shoppingCart" size={24} color={styles.content.color} badge={cartItemCount ? cartItemCount : undefined} />
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <DrawerToggleButton />
            <TitleButton />
            <ShoppingCartButton />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.primary,
    },
    content: {
        color: COLORS.textOnPrimary,
    },
});
