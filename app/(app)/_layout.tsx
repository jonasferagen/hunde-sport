// app/(app)/_layout.tsx
import { CustomBottomBar } from '@/components/menu/CustomBottomBar';
import { CustomDrawer } from '@/components/menu/CustomDrawer';
import { CustomHeader } from '@/components/menu/CustomHeader';
import { Prof } from '@/lib/debug/prof';
import type { DrawerContentComponentProps, DrawerHeaderProps } from '@react-navigation/drawer';
import Drawer from 'expo-router/drawer';
import React from 'react';
import { View } from 'tamagui';
import { DrawerScreens } from './_drawerScreens';

const AppLayout = React.memo((): React.ReactElement => {

    const screenOptions = React.useMemo(
        () => ({
            header: (props: DrawerHeaderProps) => <CustomHeader
                navigation={props.navigation}
                route={props.route}
            />,
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
                    // freezeOnBlur is true by default; turn it off for this test:
                    freezeOnBlur={false}
                >
                    <DrawerScreens />
                </Drawer>
            </Prof>

            {/* Overlay the bottom bar so it doesn't participate in per-screen re-renders */}
            <View
                pointerEvents="box-none"
                style={{
                    position: 'absolute', left: 0, right: 0, bottom: 0,
                }}
            >
                <CustomBottomBar />
            </View>
        </View >
    );
});

export default AppLayout;
// TracedDrawer.tsx

