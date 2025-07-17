import { CategoryTree } from '@/components/features/category/CategoryTree';
import { Heading, Icon } from '@/components/ui';
import { useTheme } from '@/contexts';
import { useShoppingCart } from '@/contexts/ShoppingCartProvider';
import { FONT_FAMILY, FONT_SIZES, SPACING } from '@/styles';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const CustomDrawerContent = (props: any) => {
    const { themeManager } = useTheme();
    const secondaryVariant = themeManager.getVariant('secondary');
    return (
        <LinearGradient
            colors={[secondaryVariant.borderColor, secondaryVariant.backgroundColor]}
            style={StyleSheet.absoluteFill}
        >
            <DrawerContentScrollView {...props}>

                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
                        <Icon name="close" size='xl' color={secondaryVariant.text.primary} style={{ padding: SPACING.md }} />
                    </TouchableOpacity>
                </View>
                <Heading title="HundeSport.no" />
                <DrawerItemList {...props} />
                <Heading title="Kategorier" />
                <CategoryTree variant="secondary" style={{ marginHorizontal: 10 }} />
            </DrawerContentScrollView>
        </LinearGradient>
    );
}

export default function DrawerLayout() {
    const { themeManager } = useTheme();
    const { cartItemCount } = useShoppingCart();
    const primaryVariant = themeManager.getVariant('primary');
    const secondaryVariant = themeManager.getVariant('secondary');

    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerTitleAlign: 'center',
                headerStyle: {
                    elevation: 5, // Add elevation for Android shadow
                    shadowOpacity: 0.1, // iOS shadow
                    shadowRadius: 5,
                    shadowOffset: {
                        height: 2,
                        width: 0,
                    }
                },
                headerBackground: () => (
                    <LinearGradient
                        colors={[primaryVariant.borderColor, primaryVariant.backgroundColor]}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                ),
                headerTitleStyle: {
                    color: primaryVariant.text.primary,
                    fontFamily: FONT_FAMILY.bold,
                    fontSize: FONT_SIZES.lg,
                },
                headerTintColor: primaryVariant.text.primary,
                headerShadowVisible: true,
                headerTitle: 'HundeSport.no',
                drawerActiveBackgroundColor: secondaryVariant.backgroundColor,
                drawerActiveTintColor: secondaryVariant.text.primary,
                drawerInactiveTintColor: secondaryVariant.text.primary,
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
