import { useShoppingCart } from '@/hooks/ShoppingCart/ShoppingCartProvider';
import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Heading from '../ui/Heading';
import Icon from '../ui/Icon';

export function TopMenu() {
    const { cartItemCount } = useShoppingCart();
    const router = useRouter();
    const navigation = useNavigation<DrawerNavigationProp<{}>>();
    console.log("topmenu rendered");
    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.toggleDrawer()}>
                <Icon name="menu" size={24} style={styles.content} />
            </Pressable>
            <Pressable onPress={() => router.push('/')}>
                <Heading title="hunde-sport.no" size="lg" style={styles.content} />
            </Pressable>
            <Pressable onPress={() => router.push('/shoppingCart')}>
                <Icon name="shoppingCart" size={24} color={styles.content.color} badge={cartItemCount} />
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
    content: {
        color: COLORS.textOnPrimary,
    },
});
