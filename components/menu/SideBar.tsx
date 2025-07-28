import { CustomHeader } from "@/components/menu/CustomHeader";
import Drawer from "expo-router/drawer";

export const SideBar = ({ children }: { children: React.ReactNode }) => {

    return <Drawer>
        <Drawer.Screen
            name="(store)" // This is the name of the page and must match the url from root
            options={{
                drawerLabel: 'Hjem1',
                title: 'Hjem2',
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

        {children}
    </Drawer>
} 