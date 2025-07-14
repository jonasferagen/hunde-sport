import { paths } from '@/lib/routing';
import { COLORS } from '@/styles/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { Href, Link, useSegments } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomMenu = () => {
    const insets = useSafeAreaInsets();
    const segments = useSegments();
    const currentPath = `/${segments.join('/')}`;

    const TabButton = ({ href, iconName, label }: { href: Href; iconName: React.ComponentProps<typeof FontAwesome>['name']; label: string }) => {
        const isActive = href === currentPath || (href === paths.home && currentPath === '/(drawer)/index');
        const color = isActive ? COLORS.primary : '#333';

        return (
            <Link href={href} asChild>
                <TouchableOpacity style={styles.tabButton}>
                    <FontAwesome name={iconName} size={24} color={color} />
                    <Text style={[styles.tabLabel, { color }]}>{label}</Text>
                </TouchableOpacity>
            </Link>
        );
    }

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom, height: 60 + insets.bottom }]}>
            <TabButton href={paths.home} iconName="home" label="Hjem" />
            <TabButton href={paths.search} iconName="search" label="Søk" />
            <TabButton href={paths.shoppingCart} iconName="shopping-cart" label="Handlekurv" />

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