import { useCart } from '@/hooks/Cart/CartProvider';
import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

    return (
        <View style={styles.container}>
            <Pressable onPress={() => { /* TODO: open drawer */ }}>
                <MaterialCommunityIcons name="menu" size={24} />
            </Pressable>
            <Pressable onPress={() => router.push('/')}>
                <Heading title="hunde-sport.no" size="lg" style={styles.heading} />
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
        paddingHorizontal: SPACING.md,
        height: 60,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    heading: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',

    },
    badge: {
        position: 'absolute',
        right: -6,
        top: -3,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: COLORS.textOnPrimary,
        fontSize: 10,
        fontWeight: 'bold',
    },
});
