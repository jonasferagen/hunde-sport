// BottomMenu.tsx
import { paths } from '@/config/routing';
import { useLayout, useShoppingCart, useTheme } from '@/contexts';
import { FONT_SIZES, SPACING } from '@/styles';
import { Theme } from '@/types';
import { Href, Link, usePathname } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, ValidIcon } from '../ui/icon/Icon';



interface TabButtonProps {
    href: Href;
    iconName: keyof typeof ValidIcon;
    label: string;
    badge?: number;
    isActive: boolean;
    color: string;
    styles: ReturnType<typeof createStyles>;
}

const TabButton = ({ href, iconName, label, badge, isActive, color, styles }: TabButtonProps) => (
    <Link href={href} asChild>
        <TouchableOpacity style={styles.tabButton}>
            <Icon name={iconName} color={color} badge={badge} />
            <Text style={[styles.tabLabel, { color }]}>{label}</Text>
        </TouchableOpacity>
    </Link>
);

export const BottomMenu = () => {
    const { insets, setBottomMenuHeight } = useLayout();
    const { cartItemCount } = useShoppingCart();
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const currentPath = usePathname();

    const menuItems = useMemo(() => [
        { href: paths.home, iconName: 'home', label: 'Hjem' },
        { href: paths.search, iconName: 'search', label: 'Søk' },
        { href: paths.shoppingCart, iconName: 'shoppingCart', label: 'Handlekurv', badge: cartItemCount },
    ], [cartItemCount]);

    return (
        <View
            style={[styles.container, { paddingBottom: insets.bottom }]}
            onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                setBottomMenuHeight(height + insets.bottom);
            }}
        >
            {menuItems.map(({ href, iconName, label, badge }) => {
                const isActive = href === currentPath;
                const color = isActive ? theme.colors.primary : theme.colors.textSecondary;
                const name = iconName as keyof typeof ValidIcon;
                return (
                    <TabButton
                        key={label}
                        href={href}
                        iconName={name}
                        label={label}
                        badge={badge}
                        isActive={isActive}
                        color={color}
                        styles={styles}
                    />
                );
            })}
        </View>
    );
};

const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: theme.colors.card,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        elevation: 10, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: SPACING.md,
    },
    tabLabel: {
        fontSize: FONT_SIZES.xs,
        marginTop: SPACING.xs
    },
});
