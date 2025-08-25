import { Stack, router } from 'expo-router';
import { routes } from '@/config/routes';

import { useBackHandler } from '@react-native-community/hooks';
import { useNavigationState } from '@react-navigation/native';
import { useDrawerStore } from '@/stores/drawerStore';
import { useModalStore } from '@/stores/modalStore';

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
                            freezeOnBlur: true,
                        }}
                    />
                ))}
            </Stack>
        </>
    );
}



function useShopCanGoBack() {
    return useNavigationState((top: any) => {
        const shop = top?.routes?.find((r: any) => r.name === '(shop)') as any;
        const stack = shop?.state;
        return typeof stack?.index === 'number' && stack.index > 0;
    });
}

function BackGuard() {
    const modalOpen = useModalStore(s => s.open);
    const closeModal = useModalStore(s => s.closeModal ?? s.close); // adjust to your API
    const drawerOpen = useDrawerStore(s => !s.isFullyClosed);
    const closeDrawer = useDrawerStore(s => s.closeDrawer);
    const canGoBack = useShopCanGoBack();

    useBackHandler(() => {
        // 1) Close modal if shown
        if (modalOpen) {
            closeModal?.();
            return true; // consumed
        }
        // 2) Close drawer if open
        if (drawerOpen) {
            closeDrawer?.();
            return true; // consumed
        }
        // 3) Pop shop stack if possible
        if (canGoBack) {
            router.back();
            return true; // consumed
        }
        // 4) Let the system handle (exit app on Android root)
        return false;
    });

    return null;
}
