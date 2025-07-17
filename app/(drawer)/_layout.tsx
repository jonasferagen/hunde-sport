import { CategoryTree } from '@/components/features/category/CategoryTree';
import { useTheme } from '@/contexts';
import { FONT_FAMILY, FONT_SIZES } from '@/styles';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const CustomDrawerContent = (props: any) => {
    const { theme } = useTheme();
    return (
        <DrawerContentScrollView {...props}>
            <View style={{ alignItems: 'flex-end', paddingRight: 15, paddingTop: 15, paddingBottom: 10 }}>
                <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
                    <MaterialIcons name="close" size={30} color={theme.colors.text} />
                </TouchableOpacity>
            </View>
            <DrawerItemList {...props} />
            <CategoryTree />
        </DrawerContentScrollView>
    );
}

export default function DrawerLayout() {
    const { theme } = useTheme();

    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerTitleAlign: 'center',
                headerBackground: () => (
                    <LinearGradient
                        colors={theme.gradients.primary}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                ),
                headerTitleStyle: {
                    color: theme.colors.text,
                    fontFamily: FONT_FAMILY.bold,
                    fontSize: FONT_SIZES.lg,
                },
                headerTintColor: theme.colors.text,
                headerShadowVisible: false,
                headerTitle: 'HundeSport.no',
            }}>
            <Drawer.Screen
                name="(tabs)"
                options={{
                    title: 'Hjem',
                }}
            />
            <Drawer.Screen
                name="_shoppingCart"
                options={{
                    title: 'Handlekurv',
                }}
            />
        </Drawer>
    );
}
