// app/(app)/_layout.tsx
import { CustomBottomBar } from '@/components/menu/CustomBottomBar';
import { CustomDrawer } from '@/components/menu/CustomDrawer';
import { CustomHeader } from '@/components/menu/CustomHeader';
import { routes } from '@/config/routes';
import { LoadingOverlay } from '@/screens/misc/LoadingOverlay';
import { useDrawerStore } from '@/stores/drawerStore';
import { type DrawerContentComponentProps, type DrawerHeaderProps } from '@react-navigation/drawer';
import Drawer from 'expo-router/drawer';
import React from 'react';
import { View, YStack } from 'tamagui';

const AppLayout = () => {

    const isFullyClosed = useDrawerStore((s) => s.isFullyClosed);

    const drawerContent = React.useCallback(
        (props: DrawerContentComponentProps) => <CustomDrawer navigation={props.navigation} />,
        []
    );

    const screenOptions = React.useMemo(
        () => ({
            header: () => <CustomHeader />,
            swipeEnabled: true,
            freezeOnBlur: false,          // default
            unmountOnBlur: false,        // default
            lazy: true,
        }),
        []
    );

    return (
        <View f={1} pos="relative">
            <YStack pos="absolute" fullscreen>
                <Drawer
                    drawerContent={drawerContent}
                    screenOptions={screenOptions}
                    detachInactiveScreens={false}
                    initialRouteName='(shop)'
                >
                    <Drawer.Screen name="(shop)" />
                </Drawer>
                <LoadingOverlay zi={99} />
                <CustomBottomBar zi={isFullyClosed ? 0 : -1} />
            </YStack>
        </View >
    );
};

export default AppLayout;

