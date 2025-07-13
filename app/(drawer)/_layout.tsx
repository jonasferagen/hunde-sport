import { CategoryTree } from '@/components/features/category';
import TopMenu from '@/components/layout/TopMenu';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SPACING } from '@/styles/Dimensions';

function CustomDrawerContent(props: DrawerContentComponentProps) {
    return (
        <View style={styles.drawerContent}>
            <Pressable onPress={() => props.navigation.closeDrawer()} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={30} color="black" />
            </Pressable>

            <DrawerContentScrollView {...props} >
                <DrawerItemList {...props} />
                <View>
                    <CategoryTree categoryId={0} />
                </View>
            </DrawerContentScrollView>
            <View style={{ borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: SPACING.md }}>
                <Text style={{ textAlign: 'center' }}>hunde-sport.no</Text>
            </View>
        </View>
    );
}

export default function DrawerLayout() {
    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                header: () => <TopMenu />,
                headerShown: true,
            }}
        >
            <Drawer.Screen name="index" options={{ title: 'Hjem' }} />
            <Drawer.Screen name="cart" options={{ drawerItemStyle: { display: 'flex' } }} />
            <Drawer.Screen name="category" options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="product" options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="search" options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="tag" options={{ drawerItemStyle: { display: 'none' } }} />
        </Drawer>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    closeButton: {
        position: 'absolute',
        top: SPACING.md,
        right: SPACING.md,
        zIndex: 1,
    },

});
