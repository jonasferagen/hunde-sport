import { CategoryTree } from '@/components/features/category/CategoryTree';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { cartRoute, homeRoute, useActiveRoute } from '@/hooks/useActiveRoute';
import { DrawerContentScrollView, DrawerItem, DrawerNavigationOptions } from '@react-navigation/drawer';
import { LinearGradient } from '@tamagui/linear-gradient';
import { Home, ShoppingCart, X } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useCallback, useMemo } from 'react';
import { Button, H3, H4, SizableText, Theme, YStack } from 'tamagui';


const CustomDrawerContent = React.memo((props: any) => {
    const { navigation } = props;
    const { cartItemCount } = useShoppingCartContext();

    const { isHomeActive, isCartActive } = useActiveRoute();

    const handleCloseDrawer = useCallback(() => {
        navigation.closeDrawer();
    }, [navigation]);

    const handleHomeNavigation = useCallback(() => {
        !isHomeActive && router.push(homeRoute);
        navigation.closeDrawer();
    }, [navigation, isHomeActive]);

    const handleCartNavigation = useCallback(() => {
        !isCartActive && router.push(cartRoute);
        navigation.closeDrawer();
    }, [navigation, isCartActive]);



    return (
        <YStack f={1} backgroundColor="$background">
            <DrawerContentScrollView {...props}>
                <YStack p="$4">
                    <Button
                        icon={<X color="$color" />}
                        onPress={handleCloseDrawer}
                        alignSelf="flex-end"
                        unstyled
                        pressStyle={{ opacity: 0.7 }}
                    />
                    <H3 mb="$4">HundeSport.no</H3>
                    <DrawerItem
                        label="Hjem"
                        icon={({ color }) => <Home />}
                        focused={isHomeActive}
                        onPress={handleHomeNavigation}
                        activeTintColor="$color"
                        inactiveTintColor="$color10"
                        activeBackgroundColor="$backgroundHover"
                    />
                    <DrawerItem
                        icon={({ color }) => <ShoppingCart />}
                        focused={isCartActive}
                        onPress={handleCartNavigation}
                        activeTintColor="$color"
                        inactiveTintColor="$color10"
                        activeBackgroundColor="$backgroundHover"
                        labelStyle={{ position: 'relative' }}
                        label={({ focused, color }) => (
                            <>
                                <SizableText fontWeight="bold" color={color}>Handlekurv</SizableText>
                                {cartItemCount > 0 && (
                                    <YStack
                                        backgroundColor="$red10"
                                        borderRadius={999}
                                        px="$2"
                                        py="$1"
                                        position="absolute"
                                        right={-25}
                                        top={-8}
                                    >
                                        <SizableText fontSize="$1" color="$color1">{cartItemCount}</SizableText>
                                    </YStack>
                                )}
                            </>
                        )}
                    />
                    <H4 my="$4">Kategorier</H4>
                    <CategoryTree />
                </YStack>
            </DrawerContentScrollView>
        </YStack>
    );
});

export default function DrawerLayout() {

    const headerBackground = useCallback(() => (
        <Theme name="secondary">
            <LinearGradient
                colors={['$background', '$backgroundPress']}
                start={[0, 0]}
                end={[1, 1]}
                flex={1}
            />
        </Theme>
    ), []);

    const drawerContent = useCallback((props: any) => <CustomDrawerContent {...props} />, []);

    const screenOptions = useMemo<DrawerNavigationOptions>(
        () => ({
            headerTitle: 'HundeSport.no',
            headerTitleAlign: 'center',
            headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
                shadowRadius: 0,
                shadowOffset: {
                    height: 0,
                    width: 0,
                },
            },
            headerBackground,
            headerTitleStyle: {
                color: '$color',
                fontFamily: '$body',
                fontSize: 20,
            },
            headerTintColor: '$color',
            drawerStyle: {
                backgroundColor: '$background',
                width: '80%',
            },
        }),
        [headerBackground]
    );

    return (

        <Theme name="secondary">
            <Drawer
                drawerContent={drawerContent}
                screenOptions={screenOptions}>

                <Drawer.Screen
                    name="(tabs)" // This is the actual navigator, now hidden
                    options={{ drawerItemStyle: { display: 'none' } }}
                />
            </Drawer>
        </Theme>
    );
}
