import Drawer from "expo-router/drawer";

export const SideBar = ({ children }: { children: React.ReactNode }) => {

    return <Drawer>
        <Drawer.Screen
            name="index" // This is the name of the page and must match the url from root
            options={{
                drawerLabel: 'Hjem',
                title: 'Hjem',
            }}
        />
        <Drawer.Screen
            name="categories" // This is the name of the page and must match the url from root
            options={{
                drawerLabel: 'Kategorier',
                title: 'Kategorier',
            }}
        />
        <Drawer.Screen
            name="search" // This is the name of the page and must match the url from root
            options={{
                drawerLabel: 'Søk',
                title: 'Søk',
            }}
        />
        {children}
    </Drawer>
}