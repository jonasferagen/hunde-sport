
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { cartRoute, homeRoute, searchRoute, useActiveRoute } from '@/hooks/useActiveRoute';
import { LinearGradient } from '@tamagui/linear-gradient';
import { Home, Search, ShoppingCart } from '@tamagui/lucide-icons';
import { router, Tabs } from 'expo-router';
import { SizableText, Stack } from 'tamagui';

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
                        router.push(homeRoute);
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
                        if (isSearchActive) return;
                        router.push(searchRoute);
                    },
                }}
            />
            <Tabs.Screen
                name="shopping-cart"
                options={{
                    title: 'Handlekurv',
                    tabBarIcon: ({ color }) => (
                        <Stack theme="secondary">
                            <ShoppingCart color={color} size="$3" />
                            {cartItemCount > 0 && (
                                <Stack
                                    theme="primary"
                                    position="absolute"
                                    top={-5}
                                    right={-10}
                                    backgroundColor="$background"
                                    borderWidth={1}
                                    borderColor="$borderColor"
                                    width={18}
                                    height={18}
                                    alignItems="center"
                                    justifyContent="center"
                                    borderRadius={999}

                                >
                                    <SizableText size="$1" color="$color">{cartItemCount}</SizableText>
                                </Stack>
                            )}
                        </Stack>
                    ),
                    tabBarLabel: ({ children, color }) => (
                        <SizableText size="$1" color={color}>{children}</SizableText>
                    ),
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        if (isCartActive) return;
                        router.push(cartRoute);
                    },
                }}
            />

        </Tabs>

    );
}
