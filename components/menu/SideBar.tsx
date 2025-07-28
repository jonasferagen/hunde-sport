import { CustomHeader } from "@/components/menu/CustomHeader";
import { DrawerContentComponentProps, DrawerHeaderProps } from "@react-navigation/drawer";
import Drawer from "expo-router/drawer";
import React, { JSX } from "react";
import { Theme, YStack } from "tamagui";
import { CustomDrawerContent } from "./CustomDrawerContent";

import { routeConfig } from "@/lib/routeConfig";
import { useRoute } from "@react-navigation/native";
import { getThemes } from '@tamagui/core';

export const SideBar = (): JSX.Element => {
    const route = useRoute();
    const routeName = route.name as keyof typeof routeConfig;
    const themeName = routeConfig[routeName]?.theme || 'primary';
    const theme = getThemes()[themeName]

    const drawerContent = React.useCallback((props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />, []);
    const screenOptions = React.useMemo(() => ({
        drawerStyle: {
            elevation: 5
        },
        overlayColor: theme.overlayColor?.val,
        headerShown: true,
        header: (props: DrawerHeaderProps) => <CustomHeader {...props} />,
    }), [theme]);


    return <Theme name={themeName}>
        <YStack flex={1} zIndex={5}>
            <Drawer
                drawerContent={drawerContent}
                screenOptions={screenOptions}
            >
                {Object.entries(routeConfig).map(([name, config]) => (
                    <Drawer.Screen
                        key={name}
                        name={name}
                        options={{ title: config.label }}
                    />
                ))}
            </Drawer>
        </YStack>
    </Theme>
};  