// app/(app)/_layout.tsx
import { CustomBottomBar } from '@/components/menu/CustomBottomBar';
import { CustomDrawer } from '@/components/menu/CustomDrawer';
import { CustomHeader } from '@/components/menu/CustomHeader';
import { Prof } from '@/lib/debug/prof';
import { LoadingOverlay } from '@/screens/misc/LoadingOverlay';
import type { DrawerContentComponentProps, DrawerHeaderProps } from '@react-navigation/drawer';
import Drawer from 'expo-router/drawer';
import React from 'react';
import { View } from 'tamagui';

const AppLayout = React.memo((): React.ReactElement => {

    const screenOptions = React.useMemo(
        () => ({
            header: (props: DrawerHeaderProps) => <CustomHeader {...props} />,
            swipeEnabled: true,
            freezeOnBlur: true,          // default
            unmountOnBlur: false,        // default
            lazy: true
        }),
        []
    );

    const drawerContent = React.useCallback(
        (props: DrawerContentComponentProps) => (
            <CustomDrawer navigation={props.navigation} />
        ),
        []
    );

    return (
        <View f={1} >
            <Prof id="drawer">
                <Drawer
                    drawerContent={drawerContent}
                    screenOptions={screenOptions}
                    detachInactiveScreens={false}
                >
                    <DrawerScreens />
                </Drawer>
            </Prof>
            {/* Global overlay */}
            <LoadingOverlay />

            <View style={{ position: 'relative', left: 0, right: 0, bottom: 0 }}>
                <CustomBottomBar />
            </View>

        </View >
    );
});

export default AppLayout;


// app/(app)/DrawerScreens.tsx
import { routes } from '@/config/routes';

const DrawerScreens = React.memo((): React.ReactElement => {
    return (
        <>
            {Object.values(routes).map((route) => (
                <Drawer.Screen
                    key={route.name}
                    name={route.name}
                    options={{
                        title: route.label,
                        ...(route.showInDrawer ? {} : { drawerItemStyle: { display: 'none' as const } }),
                    }}
                />
            ))}
        </>
    );
});
