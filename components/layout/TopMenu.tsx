import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Heading, Icon, SearchBar } from '../ui/';

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
                    <Heading title="hunde-sport.no" size="lg" style={styles.content} />
                </View>
                <SearchBar placeholder="Hva leter du etter?" />
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
        textShadowColor: COLORS.textOnSecondary,
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },

});
