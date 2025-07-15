import { CustomText, Icon, SearchBar } from '@/components/ui';
import { paths } from '@/config/routing';
import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export const TopMenu = React.memo(() => {

    const DrawerToggleButton = () => {
        const navigation = useNavigation<DrawerNavigationProp<{}>>();
        return (
            <Pressable onPress={() => navigation.toggleDrawer()}>
                <Icon name="menu" size="xxl" style={styles.content} />
            </Pressable>
        );
    };

    return (
        <LinearGradient colors={COLORS.gradientPrimary}>
            <View style={styles.container}>
                <View style={styles.headerTopRow}>
                    <DrawerToggleButton />
                    <CustomText bold size="lg" style={styles.content}>hunde-sport.no</CustomText>
                </View>
                {usePathname() === paths.home && <SearchBar placeholder="Hva leter du etter?" />}
            </View>
        </LinearGradient>
    );
});

const styles = StyleSheet.create({
    container: {
        padding: SPACING.lg,
    },
    content: {
        color: COLORS.textOnPrimary,

    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },

});
