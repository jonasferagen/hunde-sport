import { useShoppingCart } from '@/hooks/ShoppingCart/ShoppingCartProvider';
import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Heading } from '../ui';
import Icon from '../ui/Icon';
import IconBadge from '../ui/IconBadge';

export function TopMenu() {
    const { cartItemCount } = useShoppingCart();
    const router = useRouter();
    const navigation = useNavigation<DrawerNavigationProp<{}>>();
    console.log("topmenu rendered");
    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.toggleDrawer()}>
                <Icon name="bars" size={24} style={styles.content} />
            </Pressable>
            <Pressable onPress={() => router.push('/')}>
                <Heading title="hunde-sport.no" size="lg" style={styles.content} />
            </Pressable>
            <Pressable onPress={() => router.push('/shoppingCart')}>
                <IconBadge name="shopping-cart" size={24} color={styles.content.color} count={cartItemCount} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.primary,
    },


    badge: {
        position: 'absolute',
        right: -6,
        top: -3,
        backgroundColor: COLORS.secondary,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        color: COLORS.textOnPrimary,
    },
});
