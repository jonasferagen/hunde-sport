import { paths } from '@/config/routing';
import { useLayout, useShoppingCart, useTheme } from '@/contexts';
import { FONT_SIZES, SPACING } from '@/styles';
import { Theme } from '@/types';
import { Href, Link, useSegments } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, ValidIcon } from '../ui/icon/Icon';

const BottomMenu = () => {
    const { insets, setBottomMenuHeight } = useLayout();
    console.log("bottommenu rendered");
    const segments = useSegments();
    const { cartItemCount } = useShoppingCart();
    const currentPath = `/${segments.join('/')}`;
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const TabButton = ({ href, iconName, label, badge }: { href: Href; iconName: keyof typeof ValidIcon, label: string, badge?: number }) => {
        const isActive = href === currentPath || (href === paths.home && currentPath === '/(drawer)/index');
        const color = isActive ? theme.colors.primary : theme.colors.textSecondary;

        return (
            <Link href={href} asChild>
                <TouchableOpacity style={styles.tabButton}>
                    <Icon name={iconName} color={color} badge={badge} />
                    <Text style={[styles.tabLabel, { color }]}>{label}</Text>
                </TouchableOpacity>
            </Link>
        );
    }

    return (
        <View
            style={[styles.container, { paddingBottom: insets.bottom }]}
            onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                setBottomMenuHeight(height + insets.bottom);
            }}
        >
            <TabButton href={paths.home} iconName="home" label="Hjem" />
            <TabButton href={paths.search} iconName="search" label="Søk" />
            <TabButton href={paths.shoppingCart} iconName="shoppingCart" label="Handlekurv" badge={cartItemCount} />
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

export default BottomMenu;