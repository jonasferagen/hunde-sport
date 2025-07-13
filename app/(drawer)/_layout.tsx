import { CategoryTree } from '@/components/features/category';
import { TopMenu } from '@/components/layout/TopMenu';
import Icon from '@/components/ui/Icon';
import { useShoppingCart } from '@/hooks/ShoppingCart/ShoppingCartProvider';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BORDER_RADIUS, SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';

function CustomDrawerContent(props: DrawerContentComponentProps) {

    const gradientColors = ['#4c669f', '#3b5998', '#192f6a'] as const;
    const [isCategoryTreeVisible, setCategoryTreeVisible] = React.useState(true);

    return (
        <LinearGradient
            colors={gradientColors}
            style={styles.drawerContent}
        >
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>hunde-sport.no</Text>
                <Pressable onPress={() => props.navigation.closeDrawer()} style={styles.closeButton}>
                    <Icon name="close" size={30} color="white" />
                </Pressable>
            </View>
            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>

                <View style={styles.drawerItemsContainer}>
                    <DrawerItemList {...props} />
                </View>
                <Pressable onPress={() => setCategoryTreeVisible(!isCategoryTreeVisible)} style={styles.customDrawerItem}>
                    <Icon name="tags" size={24} color={'#ccc'} style={styles.customDrawerIcon} />
                    <View style={styles.productsLabelContainer}>
                        <Text style={styles.drawerLabel}>Produkter</Text>
                        <Icon name={isCategoryTreeVisible ? "chevron-up" : "chevron-down"} size={16} color={'#ccc'} />
                    </View>
                </Pressable>

                {isCategoryTreeVisible && (
                    <View style={styles.categoryContainer}>
                        <CategoryTree categoryId={0} />
                    </View>
                )}
            </DrawerContentScrollView>

        </LinearGradient>
    );
}

export default function DrawerLayout() {
    const { cartItemCount } = useShoppingCart();
    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                header: () => <TopMenu />,
                headerShown: true,
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#ccc',
                drawerLabelStyle: styles.drawerLabel,
            }}
        >
            <Drawer.Screen name="index" options={{ title: 'Hjem', drawerIcon: ({ color }) => <Icon name="home" size={24} color={color} /> }} />
            <Drawer.Screen
                name="shoppingCart"
                options={{
                    title: 'Handlekurv',
                    drawerIcon: ({ color, size }) => (
                        <View>
                            <Icon name="shopping-cart" size={size} color={color} />
                            {cartItemCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{cartItemCount}</Text>
                                </View>
                            )}
                        </View>
                    ),
                }}
            />
            <Drawer.Screen name="category" options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="product" options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="search" options={{ drawerItemStyle: { display: 'none' } }} />

        </Drawer>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        borderRadius: BORDER_RADIUS.md,
    },
    headerContainer: {
        padding: SPACING.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
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
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
    customDrawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md, // Adjust as needed
        paddingVertical: SPACING.md,   // Adjust as needed
    },
    customDrawerIcon: {
        marginRight: SPACING.sm,
    },
    productsLabelContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    drawerLabel: {
        color: '#ccc',
        fontSize: FONT_SIZES.md,
        marginLeft: 0,
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
        marginLeft: SPACING.lg,
    },

});
