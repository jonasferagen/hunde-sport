import { useCart } from '@/hooks/Cart/CartProvider';
import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Heading } from '../ui';

const Badge = ({ count }: { count: number }) => {
    if (count === 0) return null;
    return (
        <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
        </View>
    );
};

export default function TopMenu() {
    const { items } = useCart();
    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const router = useRouter();
    const navigation = useNavigation<DrawerNavigationProp<{}>>();

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.toggleDrawer()}>
                <MaterialCommunityIcons name="menu" size={24} />
            </Pressable>
            <Pressable onPress={() => router.push('/')}>
                <Heading title="hunde-sport.no" size="lg" />
            </Pressable>
            <Pressable onPress={() => router.push('/cart')}>
                <MaterialCommunityIcons name="cart-outline" size={24} />
                <Badge count={cartItemCount} />
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
        backgroundColor: COLORS.accent,
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
});
