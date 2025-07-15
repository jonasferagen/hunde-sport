import { CustomText, Icon, SearchBar } from '@/components/ui';
import { paths } from '@/config/routing';
import { useTheme } from '@/contexts';
import { SPACING } from '@/styles';
import { Theme } from '@/types';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export const TopMenu = React.memo(() => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const DrawerToggleButton = () => {
        const navigation = useNavigation<DrawerNavigationProp<{}>>();
        return (
            <Pressable onPress={() => navigation.toggleDrawer()}>
                <Icon name="menu" size="xxl" style={styles.content} />
            </Pressable>
        );
    };

    return (
        <LinearGradient colors={theme.gradients.primary} style={{ height: 'auto' }}>
            <View style={styles.container}>
                <View style={styles.headerTopRow}>
                    <DrawerToggleButton />
                    <CustomText bold size="lg" style={styles.content}>hunde-sport.no</CustomText>
                </View>
                {usePathname() === paths.home && <View style={{ marginTop: SPACING.md }}><SearchBar placeholder="Hva leter du etter?" /></View>}
            </View>
        </LinearGradient>
    );
});

const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        padding: SPACING.md,

    },
    content: {
        color: theme.textOnColor.primary,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },

});
