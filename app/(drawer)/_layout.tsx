import { CategoryTree } from '@/components/features/category/CategoryTree';
import { Heading, Icon } from '@/components/ui';
import { useThemeContext } from '@/contexts';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { BORDER_RADIUS, FONT_FAMILY, FONT_SIZES, SPACING } from '@/styles';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { useSegments } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const getDrawerItemProps = (themeManager: any) => {
    const secondaryVariant = themeManager.getVariant('secondary');
    return {
        activeTintColor: secondaryVariant.text.primary,
        inactiveTintColor: secondaryVariant.text.primary,
        activeItemStyle: {
            backgroundColor: secondaryVariant.backgroundColor,
            borderRadius: BORDER_RADIUS.lg,
            borderColor: 'red',
            borderWidth: 1,
        },
        inactiveItemStyle: {
            backgroundColor: secondaryVariant.backgroundColor,
            borderRadius: BORDER_RADIUS.lg,
            borderColor: 'red',
            borderWidth: 1,
        },
        labelStyle: {
            fontFamily: FONT_FAMILY.regular,
            fontSize: FONT_SIZES.md,
        }
    }
}

const CustomDrawerContent = React.memo((props: any) => {
    const { navigation } = props;
    const segments = useSegments() as string[];
    const { themeManager } = useThemeContext();
    const secondaryVariant = themeManager.getVariant('secondary');
    const { cartItemCount } = useShoppingCartContext();

    const drawerItemProps = useMemo(() => getDrawerItemProps(themeManager), [themeManager]);

    const handleCloseDrawer = useCallback(() => {
        props.navigation.closeDrawer();
    }, [props.navigation]);

    const handleHomeNavigation = useCallback(() => {
        navigation.navigate('_home');
    }, [navigation]);

    const handleCartNavigation = useCallback(() => {
        navigation.navigate('_shoppingCart');
    }, [navigation]);

    return (
        <LinearGradient
            colors={[secondaryVariant.borderColor, secondaryVariant.backgroundColor]}
            style={StyleSheet.absoluteFill}
        >
            <DrawerContentScrollView {...props}>

                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={handleCloseDrawer}>
                        <Icon name="close" size='xl' color={secondaryVariant.text.primary} style={{ padding: SPACING.md }} />
                    </TouchableOpacity>
                </View>
                <Heading title="HundeSport.no" style={{ marginBottom: SPACING.md }} />
                <DrawerItem
                    label="Hjem"
                    icon={({ color }) => <Icon name="home" color={color} size="xl" />}
                    focused={segments[3] === 'index'}
                    onPress={handleHomeNavigation}
                    {...drawerItemProps}
                />
                <DrawerItem
                    label="Handlekurv"
                    icon={({ color }) => <Icon name="shoppingCart" color={color} size="xl" badge={cartItemCount} />}
                    focused={segments[3] === 'shoppingCart'}
                    onPress={handleCartNavigation}
                    {...drawerItemProps}
                />
                <Heading title="Kategorier" style={{ marginVertical: SPACING.md }} />
                <CategoryTree variant="secondary" style={{ marginHorizontal: 10 }} />
            </DrawerContentScrollView>
        </LinearGradient>
    );
});

export default function DrawerLayout() {
    const { themeManager } = useThemeContext();

    const primaryVariant = themeManager.getVariant('primary');
    const secondaryVariant = themeManager.getVariant('secondary');

    const headerBackground = useCallback(() => (
        <LinearGradient
            colors={[primaryVariant.borderColor, primaryVariant.backgroundColor]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        />
    ), [primaryVariant.borderColor, primaryVariant.backgroundColor]);

    const drawerContent = useCallback((props: any) => <CustomDrawerContent {...props} />, []);

    const screenOptions = useMemo(() => ({
        headerTitleAlign: 'center' as const,
        headerStyle: {
            elevation: 5, // Add elevation for Android shadow
            shadowOpacity: 0.1, // iOS shadow
            shadowRadius: 5,
            shadowOffset: {
                height: 2,
                width: 0,
            }
        },
        headerBackground,
        headerTitleStyle: {
            color: primaryVariant.text.primary,
            fontFamily: FONT_FAMILY.bold,
            fontSize: FONT_SIZES.lg,
        },
        headerTintColor: primaryVariant.text.primary,
        headerShadowVisible: true,
        headerTitle: 'HundeSport.no',
        drawerActiveBackgroundColor: secondaryVariant.backgroundColor,
        drawerActiveTintColor: secondaryVariant.text.primary,
        drawerInactiveTintColor: secondaryVariant.text.secondary,
        drawerLabelStyle: {
            fontFamily: FONT_FAMILY.regular,
            fontSize: FONT_SIZES.md,
        },
        drawerStyle: {
            backgroundColor: 'transparent',
        }
    }), [
        headerBackground,
        primaryVariant.text.primary,
        secondaryVariant.backgroundColor,
        secondaryVariant.text.primary,
        secondaryVariant.text.secondary
    ]);

    return (

        <Drawer
            drawerContent={drawerContent}
            screenOptions={screenOptions}>

            <Drawer.Screen
                name="(tabs)" // This is the actual navigator, now hidden
                options={{ drawerItemStyle: { display: 'none' } }}
            />
        </Drawer>
    );
}
