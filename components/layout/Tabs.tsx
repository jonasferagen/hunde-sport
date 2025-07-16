// BottomMenu.tsx
import { paths } from '@/config/routes';
import { useLayout, useShoppingCart, useTheme } from '@/contexts';
import { FONT_SIZES, SPACING } from '@/styles';
import { Theme } from '@/types';
import { Href, Link, usePathname } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, ValidIcon } from '../ui/icon/Icon';



interface BaseButtonProps {
    iconName: keyof typeof ValidIcon;
    label: string;
    badge?: number;
    isActive: boolean;
    color: string;
    styles: ReturnType<typeof createStyles>;
}

interface TabButtonProps extends BaseButtonProps {
    href: Href;
}

interface ActionButtonProps extends BaseButtonProps {
    onPress: () => void;
}

const TabButton = ({ href, iconName, label, badge, color, styles }: TabButtonProps) => (
    <Link href={href} asChild>
        <TouchableOpacity style={styles.tabButton}>
            <Icon name={iconName} color={color} badge={badge} />
            <Text style={[styles.tabLabel, { color }]}>{label}</Text>
        </TouchableOpacity>
    </Link>
);

const ActionButton = ({ onPress, iconName, label, badge, color, styles }: ActionButtonProps) => (
    <TouchableOpacity onPress={onPress} style={styles.tabButton}>
        <Icon name={iconName} color={color} badge={badge} />
        <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
);

export const Tabs = () => {
    const { insets, setBottomMenuHeight, toggleSidebar, isSidebarVisible } = useLayout();
    const { cartItemCount } = useShoppingCart();
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const currentPath = usePathname();

    const menuItems = useMemo(() => [
        { id: 'home', href: paths.home, iconName: 'home', label: 'Hjem' },
        { id: 'menu', action: toggleSidebar, iconName: 'menu', label: 'Meny' },
        { id: 'search', href: paths.search, iconName: 'search', label: 'Søk' },
        { id: 'cart', href: paths.shoppingCart, iconName: 'shoppingCart', label: 'Handlekurv', badge: cartItemCount },
    ], [cartItemCount, toggleSidebar]);

    return (
        <View
            style={[styles.container, { paddingBottom: insets.bottom }]}
            onLayout={(event) => {
                const { height } = event.nativeEvent.layout;

                setBottomMenuHeight(height);
            }}
        >
            {menuItems.map((item) => {
                const isActive = item.href ? item.href === currentPath : (item.id === 'menu' && isSidebarVisible);
                const color = isActive ? theme.colors.primary : theme.colors.textSecondary;
                const name = item.iconName as keyof typeof ValidIcon;

                if (item.href) {
                    return (
                        <TabButton
                            key={item.id}
                            href={item.href}
                            iconName={name}
                            label={item.label}
                            badge={item.badge}
                            isActive={isActive}
                            color={color}
                            styles={styles}
                        />
                    );
                }

                if (item.action) {
                    return (
                        <ActionButton
                            key={item.id}
                            onPress={item.action}
                            iconName={name}
                            label={item.label}
                            badge={item.badge}
                            isActive={isActive}
                            color={color}
                            styles={styles}
                        />
                    );
                }
                return null;
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
        ...theme.styles.shadow,
        zIndex: 200,
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
