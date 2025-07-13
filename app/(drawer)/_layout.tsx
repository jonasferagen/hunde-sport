import { CategoryTree } from '@/components/features/category';
import { TopMenu } from '@/components/layout/TopMenu';
import Icon from '@/components/ui/Icon';
import { useShoppingCart } from '@/hooks/ShoppingCart/ShoppingCartProvider';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';

function CustomDrawerContent(props: DrawerContentComponentProps) {

    const gradientColors = ['#4c669f', '#3b5998', '#192f6a'] as const;
    const { items } = useShoppingCart();
    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <LinearGradient
            colors={gradientColors}
            style={styles.drawerContent}
        >
            <DrawerContentScrollView {...props} >
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>hunde-sport.no</Text>
                    <Pressable onPress={() => props.navigation.closeDrawer()} style={styles.closeButton}>
                        <Icon name="close" size={30} color="white" />
                    </Pressable>
                </View>

                <View style={styles.drawerItemsContainer}>
                    <DrawerItemList {...props} />
                    <DrawerItem
                        label="Handlekurv"
                        labelStyle={styles.drawerLabel}
                        onPress={() => props.navigation.navigate('shoppingCart' as never)}
                        icon={({ color, size }) => (
                            <View>
                                <Icon name="shopping-cart" size={size} color={color} />
                                {cartItemCount > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{cartItemCount}</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    />
                </View>

                <View style={styles.categoryContainer}>
                    <CategoryTree categoryId={0} />
                </View>
            </DrawerContentScrollView>

        </LinearGradient>
    );
}

export default function DrawerLayout() {
    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                header: () => <TopMenu />,
                headerShown: true,
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#ccc',
                drawerLabelStyle: {
                    marginLeft: 0,
                    fontSize: FONT_SIZES.md,
                }
            }}
        >
            <Drawer.Screen name="index" options={{ title: 'Hjem', drawerIcon: ({ color }) => <Icon name="home" size={24} color={color} /> }} />
            <Drawer.Screen name="shoppingCart" options={{ drawerItemStyle: { display: 'flex' } }} />
            <Drawer.Screen name="category" options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="product" options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="search" options={{ drawerItemStyle: { display: 'none' } }} />

        </Drawer>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    headerContainer: {
        padding: SPACING.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: SPACING.md,
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: SPACING.lg,
        right: SPACING.lg,
    },
    drawerItemsContainer: {
        paddingTop: SPACING.md,
    },
    drawerLabel: {
        marginLeft: -20,
        fontSize: 16,
        color: '#ccc',
    },
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
    categoryContainer: {
        padding: SPACING.md,
        backgroundColor: 'rgba(0,0,0,0.1)',
        margin: SPACING.md,
        borderRadius: 8,
    }

});
