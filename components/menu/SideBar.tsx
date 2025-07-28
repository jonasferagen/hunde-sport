import { CustomHeader } from "@/components/menu/CustomHeader";
import { DrawerContentComponentProps, DrawerHeaderProps } from "@react-navigation/drawer";
import Drawer from "expo-router/drawer";
import React, { JSX } from "react";
import { Theme, useTheme } from "tamagui";
import { CustomDrawerContent } from "./CustomDrawerContent";

export const SideBar = ({ children }: { children: React.ReactNode }): JSX.Element =>
    <Theme name="secondary">
        <SideBarContent children={children} />
    </Theme>


const SideBarContent = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const theme = useTheme();

    const drawerContent = React.useCallback(
        (props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />,
        []
    );

    const screenOptions = React.useMemo(() => ({
        drawerStyle: {
            backgroundColor: theme.background.val,
            borderColor: theme.borderColor.val,
            borderWidth: 1,
            borderRadius: 4,
        },
        drawerActiveBackgroundColor: theme.backgroundFocus.val,
        drawerActiveTintColor: theme.color.val,
        drawerInactiveTintColor: theme.color10.val,
        drawerLabelStyle: {
            fontSize: 16,
        },
        headerShown: true,
        header: (props: DrawerHeaderProps) => <CustomHeader {...props} />,
    }), [theme]);

    return <Drawer
        drawerContent={drawerContent}
        screenOptions={screenOptions}
    >
        <Drawer.Screen
            name="index" // This is the name of the page and must match the url from root
            options={{
                drawerLabel: 'Hjem',
                title: 'Hjem',
            }}
        />
        <Drawer.Screen
            name="(checkout)" // This is the name of the page and must match the url from root
            options={{
                drawerLabel: 'Handlekurv',
                title: 'Handlekurv',
            }}
        />
        <Drawer.Screen
            name="search" // This is the name of the page and must match the url from root
            options={{
                drawerLabel: 'Søk',
                title: 'Søk',
            }}
        />

        <Drawer.Screen
            name="product"
            options={{
                drawerItemStyle: { display: 'none' },
            }}
        />
        <Drawer.Screen
            name="category"
            options={{
                drawerItemStyle: { display: 'none' },
            }}
        />
        {children}
    </Drawer>
}