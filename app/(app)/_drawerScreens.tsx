// app/(app)/_drawerScreens.tsx (module-scoped, imported by _layout)
import { routes } from '@/config/routes';
import Drawer from 'expo-router/drawer';
import React from 'react';


const staticOptions = (label: string, showInDrawer?: boolean) =>
    showInDrawer
        ? { title: label }
        : { title: label, drawerItemStyle: { display: 'none' as const } };

export const drawerScreens = Object.values(routes).map((route) => (
    <Drawer.Screen
        key={route.name}
        name={route.name}
        options={staticOptions(route.label, route.showInDrawer)}
    />

));

export default drawerScreens;
