// app/(app)/_layout.tsx
import { CustomDrawerContent } from '@/components/menu/CustomDrawerContent';
import React from 'react';

import { BottomBar } from '@/components/menu/BottomBar';
import { CustomHeader } from '@/components/menu/CustomHeader';
import { Prof } from '@/lib/debug/prof';
import { DrawerContentComponentProps, DrawerHeaderProps } from '@react-navigation/drawer';
import Drawer from 'expo-router/drawer';
import { View } from 'tamagui';
import { drawerScreens } from './_drawerScreens';


const AppLayout = React.memo((): React.ReactElement => {
    const drawerContent = React.useCallback(
        (props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />,
        []
    );

    const screenOptions = React.useMemo(
        () => ({
            header: (props: DrawerHeaderProps) => <CustomHeader {...props} />,
            swipeEnabled: false,
            freezeOnBlur: true,          // default
            unmountOnBlur: false,        // default
        }),
        []
    );
    const screenLayout = React.useCallback(
        (props: { route: { name: string }; children: React.ReactNode }) => {
            return (
                <Prof id={`SCENE:${props.route.name}`}>
                    {props.children}
                </Prof>
            );
        },
        []
    );

    return (
        <View f={1} >
            <Drawer
                drawerContent={drawerContent}
                screenOptions={screenOptions}
                screenLayout={screenLayout}
                detachInactiveScreens
            >
                {drawerScreens}
            </Drawer>


            {/* Overlay the bottom bar so it doesn't participate in per-screen re-renders */}
            <View
                pointerEvents="box-none"
                style={{
                    position: 'absolute', left: 0, right: 0, bottom: 0,
                }}
            >
                <BottomBar />
            </View>
        </View >
    );
});

export default AppLayout;
