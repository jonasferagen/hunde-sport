// app/(app)/_layout.tsx
import { BottomBar } from '@/components/menu/BottomBar';
import { CustomDrawerContent } from '@/components/menu/CustomDrawerContent';
import { CustomHeader } from '@/components/menu/CustomHeader';
import { DrawerContentComponentProps, DrawerHeaderProps } from '@react-navigation/drawer';
import Drawer from 'expo-router/drawer';
import React from 'react';
import { View } from 'react-native';
import { drawerScreens } from './_drawerScreens';

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
        <Prof id={`AppLayout`}>
            <View style={{ flex: 1 }}>
                <Drawer
                    drawerContent={drawerContent}
                    screenOptions={screenOptions}
                    detachInactiveScreens
                >
                    {drawerScreens /* see #2 */}
                </Drawer>

                {/* Overlay the bottom bar so it doesn't participate in per-screen re-renders */}
                <View
                    pointerEvents="box-none"
                    style={{
                        position: 'absolute', left: 0, right: 0, bottom: 0,
                    }}
                >
                    <Prof id="BottomBar">
                        <BottomBar />
                    </Prof>
                </View>
            </View>
        </Prof>
    );
});

export default AppLayout;
