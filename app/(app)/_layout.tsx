// app/(app)/_layout.tsx
import { CustomDrawerContent } from '@/components/menu/CustomDrawerContent';
import React from 'react';

import { drawerScreens } from './_drawerScreens';

import { BottomBar } from '@/components/menu/BottomBar';
import { CustomHeader } from '@/components/menu/CustomHeader';
import { Prof } from '@/lib/debug/prof';
import { DrawerContentComponentProps, DrawerHeaderProps } from '@react-navigation/drawer';
import Drawer from 'expo-router/drawer';
import { View } from 'tamagui';


const AppLayout = React.memo((): React.ReactElement => {
    const drawerContent = React.useCallback(
        (props: DrawerContentComponentProps) => <Prof id="DrawerContent" disable><CustomDrawerContent {...props} /></Prof>,
        []
    );

    const screenOptions = React.useMemo(
        () => ({
            header: (props: DrawerHeaderProps) => <Prof id="Header" disable><CustomHeader {...props} /></Prof>,
            swipeEnabled: false,
        }),
        []
    );
    const screenLayout = React.useCallback(
        (props: { route: { name: string }; children: React.ReactNode }) => (
            <Prof id={`SCENE:${props.route.name}`}>{props.children}</Prof>
        ),
        []
    );

    return (
        <View f={1} >
            <Prof key="drawer" id={`Drawer`} disable>
                <Drawer key="drawerc"
                    drawerContent={drawerContent}
                    screenOptions={screenOptions}
                    screenLayout={screenLayout}
                >
                    {drawerScreens}
                </Drawer>
            </Prof>
            {/* Overlay the bottom bar so it doesn't participate in per-screen re-renders */}
            <Prof id="BottomBar" disable>
                <View
                    pointerEvents="box-none"
                    style={{
                        position: 'absolute', left: 0, right: 0, bottom: 0,
                    }}
                >
                    <BottomBar key="bottombar" />
                </View>
            </Prof>
        </View >
    );
});

export default AppLayout;
