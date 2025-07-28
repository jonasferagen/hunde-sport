import { CustomHeader } from "@/components/menu/CustomHeader";
import Drawer from "expo-router/drawer";
import { CustomDrawerContent } from "./CustomDrawerContent";

export const SideBar = ({ children }: { children: React.ReactNode }) => {

    return <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
            name="index" // This is the name of the page and must match the url from root
            options={{
                drawerLabel: 'Hjem',
                title: 'Hjem',
                headerShown: true,
                header: (props) => <CustomHeader {...props} />,
            }}
        />
        <Drawer.Screen
            name="(checkout)" // This is the name of the page and must match the url from root
            options={{
                drawerLabel: 'Handlekurv',
                title: 'Handlekurv',
                headerShown: true,
                header: (props) => <CustomHeader {...props} />,
            }}
        />
        <Drawer.Screen
            name="search" // This is the name of the page and must match the url from root
            options={{
                drawerLabel: 'Søk',
                title: 'Søk',
                headerShown: true,
                header: (props) => <CustomHeader {...props} />,
            }}
        />

        <Drawer.Screen
            name="product" // This is the name of the page and must match the url from root
            options={{
                drawerLabel: 'Produkter',
                title: 'Produkter',
                headerShown: true,
                header: (props) => <CustomHeader {...props} />,
            }}
        />
        <Drawer.Screen
            name="category" // This is the name of the page and must match the url from root
            options={{
                drawerLabel: 'Kategorier',
                title: 'Kategorier',
                headerShown: true,
                header: (props) => <CustomHeader {...props} />,
            }}
        />
        {children}
    </Drawer>
} 