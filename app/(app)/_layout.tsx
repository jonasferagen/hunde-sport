// app/(app)/_layout.tsx
import { CustomDrawer } from '@/components/menu/CustomDrawer';
import { CustomHeader } from '@/components/menu/CustomHeader';
import { routes } from '@/config/routes';
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
            <Drawer
                drawerContent={drawerContent}
                screenOptions={screenOptions}
                detachInactiveScreens={false}
            >
                {Object.values(routes).map((route) => {
                    return <Drawer.Screen
                        key={route.name}
                        name={route.name}
                        options={{
                            title: route.label,
                            ...(route.showInDrawer ? {} : { drawerItemStyle: { display: 'none' as const } }),
                        }}
                    />
                })}
            </Drawer>


            {/* <LoadingOverlay /> */}


            {/* 
            <View style={{ flex: 1, position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                <CustomBottomBar />
            </View>Bottom bar */}
        </View >
    );
});

export default AppLayout;

