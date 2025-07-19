import { CustomText, Icon } from '@/components/ui';
import { useThemeContext } from '@/contexts';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Tabs, useSegments } from 'expo-router';

export default function TabsLayout() {
    const { themeManager } = useThemeContext();
    const { cartItemCount } = useShoppingCartContext();
    const variant = themeManager.getVariant('secondary');
    const gradient = variant.getGradient();
    const segments = useSegments() as string[];

    const isSearchActive = segments.includes('search');
    const isCartActive = segments.includes('shopping-cart');
    const isHomeActive = segments[2] === '(home)' && segments.length === 3;

    return (
        <Tabs
            screenOptions={{
                tabBarBackground: () => (
                    <LinearGradient colors={gradient} start={{ x: 0, y: .3 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }} />
                ),

                tabBarStyle: {
                    borderTopWidth: 0,
                },

                tabBarActiveTintColor: variant.text.primary,
                tabBarInactiveTintColor: variant.text.secondary,
                tabBarShowLabel: true,
                headerShown: false,
            }}>

            <Tabs.Screen
                name="(home)"
                options={{
                    title: 'Hjem',
                    tabBarIcon: () => (
                        <Icon name="home" color={isHomeActive ? variant.text.primary : variant.text.secondary} size="xl" />
                    ),
                    tabBarLabel: ({ children }) => (
                        <CustomText fontSize='xs' style={{ color: isHomeActive ? variant.text.primary : variant.text.secondary }}>{children}</CustomText>
                    ),
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        if (isHomeActive) return;
                        router.push('/(drawer)/(tabs)/(home)');
                    },
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Søk',
                    tabBarIcon: () => (

                        <Icon name="search" color={isSearchActive ? variant.text.primary : variant.text.secondary} size="xl" />
                    ),
                    tabBarLabel: ({ children }) => (
                        <CustomText fontSize='xs' style={{ color: isSearchActive ? variant.text.primary : variant.text.secondary }}>{children}</CustomText>
                    ),

                }}

                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push('/(drawer)/(tabs)/(home)/search');
                    },
                }}
            />
            <Tabs.Screen
                name="shopping-cart"
                options={{
                    title: 'Handlekurv',
                    tabBarIcon: () => (
                        <Icon name="shoppingCart" color={isCartActive ? variant.text.primary : variant.text.secondary} size="xl" badge={cartItemCount} />
                    ),
                    tabBarLabel: ({ children }) => (
                        <CustomText fontSize='xs' style={{ color: isCartActive ? variant.text.primary : variant.text.secondary }}>{children}</CustomText>
                    ),
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push('/(drawer)/(tabs)/shopping-cart');
                    },
                }}
            />
            <Tabs.Screen name="checkout" options={{ href: null }} />
            <Tabs.Screen name="billing" options={{ href: null }} />
            <Tabs.Screen name="payment" options={{ href: null }} />
            <Tabs.Screen name="order-status" options={{ href: null }} />
        </Tabs>
    );
}
