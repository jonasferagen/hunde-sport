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
import { useDrawerSettled } from '@/hooks/useDrawerSettled';
const AppLayout = React.memo((): React.ReactElement => {



    const screenOptions = React.useMemo(
        () => ({
            header: (props: DrawerHeaderProps) => <CustomHeader {...props} />,
            swipeEnabled: true,
            freezeOnBlur: false,          // default
            unmountOnBlur: false,        // default
            lazy: true,
            detachInactiveScreens: true,
            drawerStyle: { zIndex: 1000 },
        }),
        []
    );

    const drawerContent = React.useCallback(
        (props: DrawerContentComponentProps) => (
            <CustomDrawer navigation={props.navigation} />
        ),
        []
    );

    const isFullyClosed = useDrawerStore((s) => s.isFullyClosed);

    return (
        <View f={1} pos="relative">
            <YStack pos="absolute" fullscreen zIndex={0}>
                <Drawer
                    drawerContent={drawerContent}
                    screenOptions={screenOptions}
                    detachInactiveScreens={false}
                    initialRouteName='index'

                >
                    {Object.values(routes).map((route) => (
                        <Drawer.Screen
                            key={route.name}
                            name={route.name}
                            options={{
                                title: route.label,
                                lazy: !route.showInDrawer,
                                ...(route.showInDrawer ? {} : { drawerItemStyle: { display: 'none' as const } }),
                                freezeOnBlur: true,
                                sceneStyle: { backgroundColor: 'transparent' },

                            }}
                        />
                    ))}
                </Drawer>
                <LoadingOverlay zi={99} />
                <CustomBottomBar zi={isFullyClosed ? 0 : -1} />
            </YStack>
        </View >
    );
});

export default AppLayout;

