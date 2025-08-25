import { Stack } from 'expo-router';
import { routes } from '@/config/routes';
export default function ShopLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {Object.values(routes).map((route) => (
                <Stack.Screen
                    key={route.name}
                    name={route.name}
                    options={{
                        title: route.label,
                        freezeOnBlur: true,
                    }}
                />
            ))}
        </Stack>
    );
}
