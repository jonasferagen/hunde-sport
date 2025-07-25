import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { useActiveRoute } from '@/hooks/useActiveRoute';
import { LinearGradient } from '@tamagui/linear-gradient';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import { router, Tabs } from 'expo-router';
import { SizableText, YStack } from 'tamagui';

export default function TabsLayout() {
    const { cartItemCount } = useShoppingCartContext();
    const { isHomeActive, isCartActive, isSearchActive } = useActiveRoute();

    return (
        <Tabs
            screenOptions={{
                tabBarBackground: () => (
                    <LinearGradient colors={['$background', '$backgroundPress']} start={[0, 0.3]} end={[0, 1]} flex={1} />
                ),

                tabBarStyle: {
                    borderTopWidth: 0,
                },

                tabBarActiveTintColor: '$color',
                tabBarInactiveTintColor: '$color10',
                tabBarShowLabel: true,
                headerShown: false,
            }}>

            <Tabs.Screen
                name="(home)"
                options={{
                    title: 'Hjem',
                    tabBarIcon: ({ color }) => <Home color={color} size="$3" />,
                    tabBarLabel: ({ children, color }) => (
                        <SizableText size="$1" color={color}>{children}</SizableText>
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
                    tabBarIcon: ({ color }) => <Search color={color} size="$3" />,
                    tabBarLabel: ({ children, color }) => (
                        <SizableText size="$1" color={color}>{children}</SizableText>
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
                    tabBarIcon: ({ color }) => (
                        <YStack>
                            <ShoppingCart color={color} size="$3" />
                            {cartItemCount > 0 && (
                                <YStack
                                    position="absolute"
                                    top={-5}
                                    right={-10}
                                    backgroundColor="$red10"
                                    borderRadius={999}
                                    px="$1.5"
                                    py="$0.5"
                                >
                                    <SizableText size="$1" color="$color1">{cartItemCount}</SizableText>
                                </YStack>
                            )}
                        </YStack>
                    ),
                    tabBarLabel: ({ children, color }) => (
                        <SizableText size="$1" color={color}>{children}</SizableText>
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
