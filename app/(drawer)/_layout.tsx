import { CategoryTree } from '@/components/features/category';
import { TopMenu } from '@/components/layout/TopMenu';
import { Icon } from '@/components/ui/icon/Icon';
import { useShoppingCart } from '@/contexts';
import { useTheme } from '@/contexts/ThemeProvider';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/styles';
import { FONT_FAMILY } from '@/styles/Typography';
import { Theme } from '@/types';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View
            style={styles.drawerContent}
        >
            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
                <DrawerItemList {...props} />
                <View style={{ marginLeft: 20 }}>
                    <CategoryTree />
                </View>
            </DrawerContentScrollView>

        </View>
    );
}

const screenOptions = (theme: Theme) => {
    return {
        header: () => <TopMenu />,
        headerShown: true,
        drawerActiveTintColor: theme.textOnColor.primary,
        drawerInactiveTintColor: theme.textOnColor.primary,
        drawerLabelStyle: createStyles(theme).drawerLabel,
    };
};


const ShoppingCartIcon = React.memo(({ color }: { color: string }) => {
    const { cartItemCount } = useShoppingCart();
    return <Icon name="shoppingCart" color={color} badge={cartItemCount} />;
});


const DrawerNavigator = () => {
    const { theme } = useTheme();

    console.log('drawer rendering');

    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={screenOptions(theme)}
        >
            <Drawer.Screen
                name="index"
                options={{
                    title: 'Hjem',
                    drawerIcon: ({ color }) => <Icon name="home" color={color} />,
                }}
            />
            <Drawer.Screen
                name="shoppingCart"
                options={{
                    title: 'Handlekurv',
                    drawerIcon: (props) => <ShoppingCartIcon {...props} />,
                }}
            />
            <Drawer.Screen name="category" options={{ drawerLabel: 'Kategorier', drawerIcon: ({ color }) => <Icon name="categories" color={color} /> }} />
            <Drawer.Screen name="product" options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="search" options={{ drawerItemStyle: { display: 'none' } }} />

        </Drawer>
    );
}

const DrawerLayout = () => {
    return <DrawerNavigator />;
}

const createStyles = (theme: Theme) => StyleSheet.create({
    drawerContent: {
        flex: 1,
        borderTopRightRadius: BORDER_RADIUS.md,
        borderBottomRightRadius: BORDER_RADIUS.md,
    },
    headerContainer: {
        padding: SPACING.lg,
        alignItems: 'center',
        justifyContent: 'center',

    },
    headerText: {
        color: theme.textOnColor.primary,
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

    productsLabelContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    drawerLabel: {
        color: theme.textOnColor.primary,
        fontSize: FONT_SIZES.md,
        fontFamily: FONT_FAMILY.regular,
        marginLeft: 0,
    },

    categoryContainer: {
        marginLeft: SPACING.sm,
    },

});

export default DrawerLayout;