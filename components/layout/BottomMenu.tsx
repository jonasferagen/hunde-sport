import { paths } from '@/config/routing';
import { useShoppingCart } from '@/hooks/ShoppingCart/ShoppingCartProvider';
import { COLORS } from '@/styles/Colors';
import { Href, Link, useSegments } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, ValidIcon } from '../ui/Icon';

const BottomMenu = () => {
    const insets = useSafeAreaInsets();
    const segments = useSegments();
    const { cartItemCount } = useShoppingCart();
    const currentPath = `/${segments.join('/')}`;

    const TabButton = ({ href, iconName, label, badge }: { href: Href; iconName: keyof typeof ValidIcon, label: string, badge?: number }) => {
        const isActive = href === currentPath || (href === paths.home && currentPath === '/(drawer)/index');
        const color = isActive ? COLORS.primary : '#333';

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
        <View style={[styles.container, { paddingBottom: insets.bottom, height: 60 + insets.bottom }]}>
            <TabButton href={paths.home} iconName="home" label="Hjem" />
            <TabButton href={paths.search} iconName="search" label="Søk" />
            <TabButton href={paths.shoppingCart} iconName="shoppingCart" label="Handlekurv" badge={cartItemCount} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 8,
    },
    tabLabel: {
        fontSize: 10,
        marginTop: 4,
    },
});

export default BottomMenu;