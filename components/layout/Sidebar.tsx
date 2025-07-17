// components/layout/Sidebar.tsx
import { _routes } from '@/config/routes';
import { useLayout, useTheme } from '@/contexts';
import { BORDER_RADIUS, SPACING } from '@/styles';
import { Theme } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { CategoryTree } from '../features/category';
import { CustomText, Icon } from '../ui';
interface SidebarProps {
    style?: ViewStyle;
}

const menuItems = [
    {
        label: 'Hjem',
        icon: 'home',
        href: _routes.home(),
    },
    {
        label: 'Handlekurv',
        icon: 'shoppingCart',
        href: _routes.shoppingCart(),
    },
    {
        label: 'Søk',
        icon: 'search',
        href: _routes.search(),
    },
];

export const Sidebar = ({ style }: SidebarProps) => {

    const { width } = useWindowDimensions();
    const { theme } = useTheme();
    const { bottomMenuHeight, closeSidebar, sidebarAnimatedStyle } = useLayout();
    const styles = createStyles(theme);

    const sidebarWidth = width * 0.9;

    return (
        <Animated.View style={[
            styles.container,
            { bottom: bottomMenuHeight, width: sidebarWidth },
            style,
            sidebarAnimatedStyle
        ]}>
            <LinearGradient
                colors={theme.gradients.primary}
                style={styles.content}
            >
                <CustomText style={styles.header}>hunde-sport.no</CustomText>
                <ScrollView>
                    {menuItems.map((item, index) => (
                        <Link key={index} href={item.href as any} asChild onPress={closeSidebar}>
                            <Pressable style={styles.menuItem}>
                                <Icon name={item.icon} color={theme.textOnColor.primary} />
                                <CustomText bold style={{ color: theme.textOnColor.primary }}>{item.label}</CustomText>
                            </Pressable>
                        </Link>
                    ))}

                    <CustomText style={{ color: theme.textOnColor.primary }}>Produkter</CustomText>

                    <CategoryTree onSelect={closeSidebar} />

                </ScrollView>
            </LinearGradient>
        </Animated.View>
    );
}

const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100, // Ensure sidebar is on top
        ...theme.styles.shadow,
    },
    content: {
        padding: SPACING.md,
        height: '100%',
        borderRadius: BORDER_RADIUS.md,
    },
    header: {
        paddingVertical: SPACING.md,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        gap: SPACING.md,
    }
});