import { Stack } from 'expo-router';
import { routes } from '@/config/routes';
import { PortalItem } from 'tamagui';
import { useCanonicalBackHandler } from '@/hooks/useCanonicalNavigation';
import { CustomBottomBar } from '@/components/menu/CustomBottomBar';

export default function ShopLayout() {
    useCanonicalBackHandler();
    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                {Object.values(routes).map((route) => (
                    <Stack.Screen
                        key={route.name}
                        name={route.name}
                        options={{
                            title: route.label,
                            contentStyle: { backgroundColor: "transparent" }
                        }}
                    />
                ))}
            </Stack>
            <PortalItem>
                <CustomBottomBar />
            </PortalItem>

        </>
    );
}

