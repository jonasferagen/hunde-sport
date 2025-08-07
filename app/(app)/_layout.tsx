import { CustomDrawerContent } from '@/components/menu/CustomDrawerContent';
import { CustomHeader } from '@/components/menu/CustomHeader';
import { routes } from '@/config/routes';
import { CartProvider, ProductCategoryProvider } from '@/contexts';
import { DrawerContentComponentProps, DrawerHeaderProps } from '@react-navigation/drawer';
import Drawer from 'expo-router/drawer';
import React from 'react';

const AppLayout = (): React.ReactElement => {
    const drawerContent = React.useCallback(
        (props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />,
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
        <ProductCategoryProvider>
            <CartProvider>
                <Drawer drawerContent={drawerContent} screenOptions={screenOptions}>
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
            </CartProvider>
        </ProductCategoryProvider>
    );
};

export default AppLayout;
