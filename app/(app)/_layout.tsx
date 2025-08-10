import { BottomBar } from '@/components/menu/BottomBar';
import { CustomDrawerContent } from '@/components/menu/CustomDrawerContent';
import { CustomHeader } from '@/components/menu/CustomHeader';
import { routes } from '@/config/routes';
import { DrawerContentComponentProps, DrawerHeaderProps } from '@react-navigation/drawer';
import { useRoute } from '@react-navigation/native';
import Drawer from 'expo-router/drawer';
import React from 'react';
import { Theme } from 'tamagui';

const ScreenWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const route = useRoute();
    const themeName = routes[route.name]?.theme || 'primary';

    return (
        <Theme name={themeName}>
            {children}
            <BottomBar />
        </Theme>
    );
};



const AppLayout = (): React.ReactElement => {
    const drawerContent = React.useCallback(
        (props: DrawerContentComponentProps) => {
            return <CustomDrawerContent {...props} />;
        },
        []
    );

    const screenOptions = React.useMemo(
        () => ({
            header: (props: DrawerHeaderProps) => <CustomHeader {...props} />,
            swipeEnabled: true,
        }),
        []
    );

    return (
        <Drawer drawerContent={drawerContent} screenOptions={screenOptions} screenLayout={(props) => <ScreenWrapper >{props.children}</ScreenWrapper>}>
            {Object.values(routes).map((route) => (
                <Drawer.Screen
                    key={route.name}
                    name={route.name}
                    options={{
                        title: route.label,
                        drawerLabel: route.showInDrawer ? route.label : () => null,
                    }}

                />
            ))}
        </Drawer>
    );
};

export default AppLayout;

