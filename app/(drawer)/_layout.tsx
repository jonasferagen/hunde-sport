import { CategoryTree } from '@/components/features/category';
import { TopMenu } from '@/components/layout/TopMenu';
import { SearchBar } from '@/components/ui';
import { Icon } from '@/components/ui/Icon';
import { useShoppingCart } from '@/hooks/ShoppingCart/ShoppingCartProvider';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/styles';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function CustomDrawerContent(props: DrawerContentComponentProps & { isCategoryTreeVisible: boolean }) {

    return (
        <LinearGradient
            colors={COLORS.gradientPrimary}
            style={styles.drawerContent}
        >
            <View style={styles.headerContainer}>
                <Pressable onPress={() => props.navigation.closeDrawer()} style={styles.closeButton}>
                    <Icon name="close" size={24} color="white" />
                </Pressable>
                <Text style={styles.headerText}>hunde-sport.no</Text>
                <SearchBar />
            </View>
            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
                <DrawerItemList {...props} />

                {props.isCategoryTreeVisible && (
                    <View style={styles.categoryContainer}>
                        <CategoryTree categoryId={0} />
                    </View>
                )}
            </DrawerContentScrollView>

        </LinearGradient>
    );
}

export default function DrawerLayout() {
    const [isCategoryTreeVisible, setCategoryTreeVisible] = React.useState(true);

    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} isCategoryTreeVisible={isCategoryTreeVisible} />}
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
                    drawerIcon: ({ color, size }) => {
                        const { cartItemCount } = useShoppingCart();
                        return <Icon name="shoppingCart" size={size} color={color} badge={cartItemCount} />;
                    },
                }}
            />
            <Drawer.Screen name="category" options={{
                title: 'Produkter',
                drawerIcon: ({ color }) => <Icon name="categories" size={24} color={color} />,
                drawerLabel: ({ focused, color }) => (
                    <View style={styles.productsLabelContainer}>
                        <Text style={{ color, fontSize: FONT_SIZES.md }}>Produkter</Text>
                        <Icon style={styles.customDrawerIcon} name={isCategoryTreeVisible ? "expand" : "collapse"} size={16} color={color} />
                    </View>
                ),
            }} listeners={{
                drawerItemPress: (e) => {
                    e.preventDefault();
                    setCategoryTreeVisible(!isCategoryTreeVisible);
                }
            }} />
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

    },
    headerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: SPACING.lg,
        left: SPACING.lg,
    },

    customDrawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
    },
    customDrawerIcon: {
        marginRight: -SPACING.md,
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


    categoryContainer: {
        marginLeft: SPACING.lg,
    },

});
