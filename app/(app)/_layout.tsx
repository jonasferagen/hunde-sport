// app/(app)/_layout.tsx
import { CustomBottomBar } from '@/components/menu/CustomBottomBar';
import { CustomDrawer } from '@/components/menu/CustomDrawer';
import { CustomHeader } from '@/components/menu/CustomHeader';
import { ThemedYStack } from '@/components/ui';
import { routes } from '@/config/routes';
import { Prof } from '@/lib/debug/prof';
import { LoadingOverlay } from '@/screens/misc/LoadingOverlay';
import type { DrawerContentComponentProps, DrawerHeaderProps } from '@react-navigation/drawer';
import { usePathname } from 'expo-router';
import Drawer from 'expo-router/drawer';
import React from 'react';
import { View } from 'tamagui';

const AppLayout = React.memo((): React.ReactElement => {

    const screenOptions = React.useMemo(
        () => ({
            header: (props: DrawerHeaderProps) => <CustomHeader {...props} />,
            swipeEnabled: true,
            freezeOnBlur: false,          // default
            unmountOnBlur: false,        // default
            lazy: true,
            detachInactiveScreens: true
        }),
        []
    );

    const drawerContent = React.useCallback(
        (props: DrawerContentComponentProps) => (
            <Prof id="Drawer contents" ><CustomDrawer navigation={props.navigation} /></Prof>
        ),
        []
    );

    const pathname = usePathname();
    const profId = React.useMemo(
        () => `screen:${pathname.replace(/^\/|\/$/g, '') || 'index'}`,
        [pathname]
    );
    return (
        <View f={1} pos="relative">
            <ThemedYStack fullscreen zi={20}>
                <Prof id={profId} key={profId} disable>
                    <Drawer
                        drawerContent={drawerContent}
                        screenOptions={screenOptions}
                        detachInactiveScreens={false}
                        initialRouteName='cart'
                    >
                        {Object.values(routes).map((route) => (
                            <Drawer.Screen
                                key={route.name}
                                name={route.name}
                                options={{
                                    title: route.label,
                                    lazy: !route.showInDrawer,
                                    ...(route.showInDrawer ? {} : { drawerItemStyle: { display: 'none' as const } }),
                                    freezeOnBlur: true
                                }}
                            />
                        ))}
                    </Drawer>
                </Prof>
                <CustomBottomBar />
                <LoadingOverlay zi={99} />
            </ThemedYStack>
        </View >
    );
});

export default AppLayout;

