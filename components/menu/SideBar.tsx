import { CustomHeader } from "@/components/menu/CustomHeader";
import { routes } from '@/config/routes';
import { DrawerContentComponentProps, DrawerHeaderProps } from "@react-navigation/drawer";
import { useRoute } from "@react-navigation/native";
import Drawer from "expo-router/drawer";
import React, { JSX } from "react";
import { Theme, YStack } from "tamagui";
import { CustomDrawerContent } from "./CustomDrawerContent";

export const SideBar = (): JSX.Element => {
    const route = useRoute();
    const routeName = route.name;
    const themeName = routes[routeName]?.theme || 'primary';

    const drawerContent = React.useCallback((props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />, []);
    const screenOptions = React.useMemo(() => ({
        drawerStyle: {
            elevation: 5
        },
        header: (props: DrawerHeaderProps) => <CustomHeader {...props} />,
        swipeEnabled: true,

    }), []);

    return <Theme name={themeName}>
        <YStack flex={1} zIndex={5}>
            <Drawer
                drawerContent={drawerContent}
                screenOptions={screenOptions}
            >
                {Object.values(routes).map((route) => (
                    <Drawer.Screen
                        key={route.name}
                        name={route.name}
                        options={({ route: navRoute }) => ({
                            title: (navRoute.params as any)?.name || route.label,
                            drawerLabel: route.showInDrawer ? route.label : () => null,
                        })}
                    />
                ))}
            </Drawer>

        </YStack>
    </Theme>
};