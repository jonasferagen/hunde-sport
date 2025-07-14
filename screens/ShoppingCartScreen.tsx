import { PageSection } from '@/components/layout';
import { Button, Heading, Icon } from '@/components/ui';
import { useShoppingCart } from '@/hooks/ShoppingCart/ShoppingCartProvider';
import { COLORS } from '@/styles/Colors';
import { SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';
import { formatPrice } from '@/utils/helpers';
import { Stack } from 'expo-router';
import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export const ShoppingCartScreen = () => {
    const { items, updateQuantity, removeFromCart, cartTotal, cartItemCount } = useShoppingCart();

    const textColor = COLORS.accent;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Handlekurv' }} />
            <PageSection primary>
                <Heading title="Handlekurv" size="lg" />
            </PageSection>
            <FlatList
                data={items}
                keyExtractor={(item) => item.product.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Image source={{ uri: item.product.images[0].src }} style={styles.productImage} />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{item.product.name}</Text>
                            <Text style={styles.productPrice}>{formatPrice(item.product.price)}</Text>
                        </View>
                        <View style={styles.quantityContainer}>
                            <Pressable onPress={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                <Icon name="removeFromCart" size={24} color={textColor} />
                            </Pressable>
                            <Text style={styles.quantity}>{item.quantity}</Text>
                            <Pressable onPress={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                <Icon name="addToCart" size={24} color={textColor} />
                            </Pressable>
                        </View>
                        <Pressable onPress={() => removeFromCart(item.product.id)} style={{ marginLeft: SPACING.md }}>
                            <Icon name="emptyCart" size={24} color={textColor} />
                        </Pressable>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Handlekurven er tom.</Text>}
            />
            {items.length > 0 && (
                <View style={styles.summaryContainer}>
                    <View style={
                        {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }
                    }
                    >
                        <Text style={styles.totalText}>Antall: {cartItemCount}</Text>
                        <Text style={styles.totalText}>Total: {formatPrice(cartTotal)}</Text>
                    </View>
                    <Button title="Gå til kassen" icon="checkout" onPress={() => { /* TODO: Implement checkout */ }} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    textColor: {
        color: COLORS.textOnSecondary,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 5,
    },
    productInfo: {
        flex: 1,
        marginLeft: 10,
    },
    productName: {
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold'
    },
    productPrice: {
        fontSize: FONT_SIZES.sm,
        color: '#666',
        marginTop: 5,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantity: {
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    summaryContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        backgroundColor: 'white',
    },
    totalText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        textAlign: 'right',
        marginBottom: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: FONT_SIZES.md,
        color: '#666',
    },
});
