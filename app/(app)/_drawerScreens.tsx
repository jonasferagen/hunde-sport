// app/(app)/_drawerScreens.tsx (module-scoped, imported by _layout)
import { routes } from '@/config/routes';
import Drawer from 'expo-router/drawer';
import React from 'react';


// _drawerScreens.tsx
export const drawerScreens = Object.values(routes).map((route) => {

    return (
        <Drawer.Screen
            key={route.name}
            name={route.name}
            options={{
                title: route.label,
                ...(route.showInDrawer ? {} : { drawerItemStyle: { display: 'none' as const } }),

            }}
        />

    );
});

export default drawerScreens;
