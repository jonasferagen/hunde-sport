import { Icon } from '@/components/ui';
import { useTheme } from '@/contexts';
import { useShoppingCart } from '@/contexts/ShoppingCartProvider';
import { router, Tabs } from 'expo-router';

export default function TabsLayout() {
    const { themeManager } = useTheme();
    const { cartItemCount } = useShoppingCart();
    const secondaryVariant = themeManager.getVariant('secondary');
    return (
        <Tabs
            screenOptions={{

                tabBarStyle: {
                    backgroundColor: secondaryVariant.backgroundColor,
                    borderTopWidth: 2,
                    borderTopColor: secondaryVariant.borderColor,
                },
                tabBarActiveTintColor: secondaryVariant.text.primary,
                tabBarInactiveTintColor: secondaryVariant.text.secondary,
                tabBarShowLabel: true,
                headerShown: false,
            }}>

            <Tabs.Screen
                name="(home)"
                options={{
                    title: 'Hjem',
                    tabBarIcon: ({ color }) => (
                        <Icon name="home" color={color} size="xl" />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Søk',
                    tabBarIcon: ({ color }) => (
                        <Icon name="search" color={color} size="xl" />
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
                name="shoppingCart"
                options={{
                    title: 'Handlekurv',
                    tabBarIcon: ({ color }) => (
                        <Icon name="shoppingCart" color={color} size="xl" badge={cartItemCount} />
                    ),
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push('/(drawer)/(tabs)/(home)/shoppingCart');
                    },
                }}
            />
            <Tabs.Screen name="checkout" options={{ href: null }} />
        </Tabs>
    );
}
