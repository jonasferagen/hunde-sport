import { BottomBar } from '@/components/menu/BottomBar';
import { CustomDrawerContent } from '@/components/menu/CustomDrawerContent';
import { CustomHeader } from '@/components/menu/CustomHeader';
import { routes } from '@/config/routes';
import { CartProvider, ProductCategoryProvider } from '@/contexts';
import { DrawerContentComponentProps, DrawerHeaderProps } from '@react-navigation/drawer';
import { useRoute } from '@react-navigation/native';
import Drawer from 'expo-router/drawer';
import React from 'react';
import { YStack } from 'tamagui';

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
        <ProductCategoryProvider>
            <CartProvider>
                <ScreenWrapper>
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
                </ScreenWrapper>
            </CartProvider>
        </ProductCategoryProvider>
    );
};

export default AppLayout;


export const ScreenWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const route = useRoute();
    const themeName = routes[route.name]?.theme || 'primary';

    return (
        <YStack f={1} t={themeName}>
            {children}
            <BottomBar />
        </YStack>
    );
};
