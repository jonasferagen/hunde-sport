import { Icon } from '@/components/ui';
import { useTheme } from '@/contexts';
import { useShoppingCart } from '@/contexts/ShoppingCartProvider';
import { darken } from '@/utils/helpers';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    const { theme } = useTheme();
    const { cartItemCount } = useShoppingCart();
    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.card,
                },
                headerTintColor: theme.colors.text,
                tabBarStyle: {
                    backgroundColor: theme.colors.primary,
                    borderTopWidth: 2,
                    borderTopColor: darken(theme.colors.primary, 10),
                },
                tabBarActiveTintColor: theme.textOnColor.primary,
                tabBarInactiveTintColor: theme.textOnColor.primary,
                tabBarShowLabel: true,
            }}>

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Hjem',
                    tabBarIcon: ({ color }) => (
                        <Icon name="home" color={color} size="xl" />
                    ),
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
            />
            <Tabs.Screen
                name="shoppingCart"
                options={{
                    title: 'Handlekurv',
                    tabBarIcon: ({ color }) => (
                        <Icon name="shoppingCart" color={color} size="xl" badge={cartItemCount} />
                    ),
                }}
            />
            <Tabs.Screen name="category" options={{ href: null }} />
            <Tabs.Screen name="product" options={{ href: null }} />
            <Tabs.Screen name="checkout" options={{ href: null }} />
        </Tabs>
    );
}
