// app/(app)/_layout.tsx
import { CustomBottomBar } from '@/components/menu/CustomBottomBar';
import { CustomDrawerNew } from '@/components/menu/CustomDrawerNew';
import { CustomHeader } from '@/components/menu/CustomHeader';
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
            <Prof id="Drawer contents" ><CustomDrawerNew navigation={props.navigation} /></Prof>
        ),
        []
    );

    const pathname = usePathname();
    const profId = React.useMemo(
        () => `screen:${pathname.replace(/^\/|\/$/g, '') || 'index'}`,
        [pathname]
    );
    return (
        <View f={1} >
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

            <LoadingOverlay />
            <CustomBottomBar />
        </View >
    );
});

export default AppLayout;

