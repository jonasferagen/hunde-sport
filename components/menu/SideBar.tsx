import { CustomHeader } from "@/components/menu/CustomHeader";
import Drawer from "expo-router/drawer";
import { Theme, useTheme } from "tamagui";
import { CustomDrawerContent } from "./CustomDrawerContent";

export const SideBar = ({ children }: { children: React.ReactNode }) =>
    <Theme name="primary">
        <SideBarContent children={children} />
    </Theme>


const SideBarContent = ({ children }: { children: React.ReactNode }) => {
    const theme = useTheme();
    return <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
            drawerStyle: {
                backgroundColor: theme.background.val,
                borderColor: theme.borderColor.val,
                borderWidth: 1,
            },
            drawerActiveBackgroundColor: theme.backgroundFocus.val,
            drawerActiveTintColor: theme.color.val,
            drawerInactiveTintColor: theme.color10.val,
            drawerLabelStyle: {
                fontSize: 16,
            },
            headerShown: true,
            header: (props) => <CustomHeader {...props} />,
        }}
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