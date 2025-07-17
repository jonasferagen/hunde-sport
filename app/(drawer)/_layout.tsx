import { CategoryTree } from '@/components/features/category/CategoryTree';
import { Icon } from '@/components/ui';
import { useTheme } from '@/contexts';
import { useShoppingCart } from '@/contexts/ShoppingCartProvider';
import { FONT_FAMILY, FONT_SIZES } from '@/styles';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const CustomDrawerContent = (props: any) => {
    const { theme } = useTheme();
    return (
        <LinearGradient
            colors={theme.gradients.secondary}
            style={StyleSheet.absoluteFill}
        >
            <DrawerContentScrollView {...props}>
                <View style={{ alignItems: 'flex-end', paddingRight: 15, paddingTop: 15, paddingBottom: 10 }}>
                    <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
                        <Icon name="close" size='xl' color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
                <DrawerItemList {...props} />
                <CategoryTree variant="secondary" />
            </DrawerContentScrollView>
        </LinearGradient>
    );
}

export default function DrawerLayout() {
    const { theme } = useTheme();
    const { cartItemCount } = useShoppingCart();

    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerTitleAlign: 'center',
                headerBackground: () => (
                    <LinearGradient
                        colors={theme.gradients.primary}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                ),
                headerTitleStyle: {
                    color: theme.colors.text,
                    fontFamily: FONT_FAMILY.bold,
                    fontSize: FONT_SIZES.lg,
                },
                headerTintColor: theme.colors.text,
                headerShadowVisible: false,
                headerTitle: 'HundeSport.no',
                drawerActiveBackgroundColor: theme.colors.secondary,
                drawerActiveTintColor: theme.textOnColor.secondary,
                drawerInactiveTintColor: theme.textOnColor.secondary,
                drawerLabelStyle: {
                    fontFamily: FONT_FAMILY.regular,
                    fontSize: FONT_SIZES.md,
                },
                drawerStyle: {
                    backgroundColor: 'transparent',
                }
            }}>

            <Drawer.Screen
                name="(tabs)" // This is the actual navigator, now hidden
                options={{ drawerItemStyle: { display: 'none' } }}
            />

            <Drawer.Screen
                name="_home" // This is a dummy screen for the drawer item
                options={{
                    title: 'Hjem',
                    drawerIcon: ({ color }) => <Icon name="home" color={color} size="xl" />
                }}
                listeners={{
                    drawerItemPress: (e) => {
                        e.preventDefault();
                        router.push('/(drawer)/(tabs)');
                    }
                }}
            />
            <Drawer.Screen
                name="_shoppingCart" // This is a dummy screen for the drawer item
                options={{
                    title: 'Handlekurv',
                    drawerIcon: ({ color }) => <Icon name="shoppingCart" color={color} size='xl' badge={cartItemCount} />
                }}
                listeners={{
                    drawerItemPress: (e) => {
                        e.preventDefault();
                        router.push('/(drawer)/(tabs)/shoppingCart');
                    }
                }}
            />
        </Drawer>
    );
}
