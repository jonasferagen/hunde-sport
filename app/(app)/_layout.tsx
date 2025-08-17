// app/(app)/_layout.tsx
import { CustomDrawerContent } from '@/components/menu/CustomDrawerContent';
import { DrawerContentComponentProps, DrawerHeaderProps } from '@react-navigation/drawer';
import Drawer from 'expo-router/drawer';
import React from 'react';
import { View } from 'react-native';
import { drawerScreens } from './_drawerScreens';

import { BottomBar } from '@/components/menu/BottomBar';
import { CustomHeader } from '@/components/menu/CustomHeader';
import { Prof } from '@/lib/debug/prof';

const AppLayout = React.memo((): React.ReactElement => {
    const drawerContent = React.useCallback(
        (props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />,
        []
    );

    const screenOptions = React.useMemo(
        () => ({
            header: (props: DrawerHeaderProps) => <CustomHeader {...props} />,
            swipeEnabled: true,
            freezeOnBlur: true,          // ← requires react-native-screens + enableFreeze(true)
        }),
        []
    );

    return (

        <View style={{ flex: 1 }}>
            <Prof id={`Drawer`}>
                <Drawer
                    drawerContent={drawerContent}
                    screenOptions={screenOptions}
                >
                    {drawerScreens}
                </Drawer>
            </Prof>
            {/* Overlay the bottom bar so it doesn't participate in per-screen re-renders */}
            <Prof id="BottomBar">
                <View
                    pointerEvents="box-none"
                    style={{
                        position: 'absolute', left: 0, right: 0, bottom: 0,
                    }}
                >
                    <BottomBar />
                </View>
            </Prof>
        </View >
    );
});

export default AppLayout;
