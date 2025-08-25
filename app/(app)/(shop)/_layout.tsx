import { Stack, router } from 'expo-router';
import { routes } from '@/config/routes';

import { useBackHandler } from '@react-native-community/hooks';
import { useNavigationState } from '@react-navigation/native';

export default function ShopLayout() {
    return (
        <><BackGuard />
            <Stack screenOptions={{ headerShown: false }}>
                {Object.values(routes).map((route) => (
                    <Stack.Screen
                        key={route.name}
                        name={route.name}
                        options={{
                            title: route.label,
                            freezeOnBlur: false,
                        }}

                    />
                ))}
            </Stack>
        </>
    );
}

const BackGuard = () => {

    const canGoBack = useNavigationState((s: any) => !!s?.routes?.find((r: any) => r.name === '(shop)')?.state?.index);

    useBackHandler(() => {

        if (!canGoBack) return false;
        router.back();
        return true;
    });

    return null;
}
