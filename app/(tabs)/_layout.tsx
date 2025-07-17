import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Søk',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="search" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="shoppingCart"
                options={{
                    title: 'Handlekurv',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="shopping-cart" size={size} color={color} />
                    ),
                }}
            />

            {/* The following screens are part of the tab navigator but not visible in the tab bar */}
            <Tabs.Screen name="category" options={{ href: null }} />
            <Tabs.Screen name="product" options={{ href: null }} />
            <Tabs.Screen name="checkout" options={{ href: null }} />
        </Tabs>
    );
}
