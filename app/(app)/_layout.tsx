// app/(app)/_layout.tsx
import { CustomBottomBar } from '@/components/menu/CustomBottomBar';
import { CustomDrawer } from '@/components/menu/CustomDrawer';
import { CustomHeader } from '@/components/menu/CustomHeader';
import { routes } from '@/config/routes';
import { LoadingOverlay } from '@/screens/misc/LoadingOverlay';
import { type DrawerContentComponentProps, type DrawerHeaderProps } from '@react-navigation/drawer';
import Drawer from 'expo-router/drawer';
import React from 'react';
import { View, YStack } from 'tamagui';

const AppLayout = React.memo((): React.ReactElement => {

    const [drawerFullyClosed, setDrawerFullyClosed] = React.useState(true)

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
            <CustomDrawer navigation={props.navigation} onSettledChange={setDrawerFullyClosed} />
        ),
        []
    );

    const bottombarZi = React.useMemo(() => {
        return -1;
    }, []);

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
                <CustomBottomBar zi={drawerFullyClosed ? 0 : -1} />
            </YStack>
        </View >
    );
});

export default AppLayout;

