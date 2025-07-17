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

                tabBarStyle: {
                    backgroundColor: theme.colors.secondary,
                    borderTopWidth: 2,
                    borderTopColor: darken(theme.colors.secondary, 10),
                },
                tabBarActiveTintColor: theme.colors.text,
                tabBarInactiveTintColor: theme.textOnColor.secondary,
                tabBarShowLabel: true,
                headerShown: false,
            }}>

            <Tabs.Screen
                name="index"
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
            <Tabs.Screen name="category" options={{ href: null, headerShown: false }} />
            <Tabs.Screen name="product" options={{ href: null, headerShown: false }} />
            <Tabs.Screen name="checkout" options={{ href: null }} />
        </Tabs>
    );
}
