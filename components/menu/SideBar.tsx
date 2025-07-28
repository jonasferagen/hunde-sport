import { CustomHeader } from "@/components/menu/CustomHeader";
import { DrawerContentComponentProps, DrawerHeaderProps } from "@react-navigation/drawer";
import Drawer from "expo-router/drawer";
import React, { JSX } from "react";
import { Theme, useTheme, YStack } from "tamagui";
import { CustomDrawerContent } from "./CustomDrawerContent";

export const SideBar = (): JSX.Element =>
    <Theme name="secondary">
        <YStack flex={1} zIndex={2}>
            <SideBarContent />
        </YStack>
    </Theme >


const SideBarContent = (): JSX.Element => {
    const theme = useTheme();
    const drawerContent = React.useCallback(
        (props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />,
        []
    );

    const screenOptions = React.useMemo(() => ({
        drawerStyle: {
            elevation: 5
        },
        overlayColor: theme.overlayColor?.val,
        headerShown: true,
        header: (props: DrawerHeaderProps) => <CustomHeader {...props} />,
    }), [theme]);

    return <Drawer

        drawerContent={drawerContent}
        screenOptions={screenOptions}
    >


    </Drawer>
}