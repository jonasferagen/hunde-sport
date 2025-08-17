// app/(app)/DrawerScreens.tsx
import { routes } from '@/config/routes';
import Drawer from 'expo-router/drawer';
import React from 'react';

export const DrawerScreens = React.memo(function DrawerScreens() {
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

export default DrawerScreens;
