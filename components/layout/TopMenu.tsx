import { FONT_SIZES } from '@/styles';
import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Heading, Icon, SearchBar } from '../ui/';

export const TopMenu = React.memo(() => {

    const DrawerToggleButton = () => {
        const navigation = useNavigation<DrawerNavigationProp<{}>>();
        return (
            <Pressable onPress={() => navigation.toggleDrawer()}>
                <Icon name="menu" size={FONT_SIZES.xxl} style={styles.content} />
            </Pressable>
        );
    };

    const Title = () => {
        return (
            <Heading title="hunde-sport.no" size="lg" style={styles.content} />
        );
    };

    return (
        <View style={styles.homeHeaderContainer}>
            <View style={styles.homeHeaderTopRow}>
                <DrawerToggleButton />
                <Title />
            </View>
            <SearchBar placeholder="Hva leter du etter?" />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.primary,
    },
    content: {
        color: COLORS.textOnPrimary,
    },
    homeHeaderContainer: {
        backgroundColor: COLORS.headerBackground,
        padding: SPACING.lg
    },
    homeHeaderTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    greetingContainer: {
        marginBottom: SPACING.lg,
    },
    greetingText: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textOnPrimary,
    },
    userName: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: 'bold',
        color: COLORS.textOnPrimary,
    },
});
