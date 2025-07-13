import { PageSection } from '@/components/layout';
import { Heading } from '@/components/ui';
import { useShoppingCart } from '@/hooks/ShoppingCart/ShoppingCartProvider';
import { COLORS } from '@/styles/Colors';
import { FONT_SIZES } from '@/styles/Typography';
import { formatPrice } from '@/utils/helpers';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { Button, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ShoppingCartScreen() {
    const { items, updateQuantity, removeFromCart } = useShoppingCart();

    const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Handlekurv' }} />
            <PageSection type='primary'>
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
                                <MaterialCommunityIcons name="minus-circle-outline" size={24} color="#666" />
                            </Pressable>
                            <Text style={styles.quantity}>{item.quantity}</Text>
                            <Pressable onPress={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#666" />
                            </Pressable>
                        </View>
                        <Pressable onPress={() => removeFromCart(item.product.id)} style={{ marginLeft: 15 }}>
                            <MaterialCommunityIcons name="trash-can-outline" size={24} color="#f00" />
                        </Pressable>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Handlekurven er tom.</Text>}
            />
            {items.length > 0 && (
                <View style={styles.summaryContainer}>
                    <Text style={styles.totalText}>Total: {formatPrice(totalPrice)}</Text>
                    <Button title="Gå til kassen" onPress={() => { /* TODO: Implement checkout */ }} />
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
        fontWeight: 'bold',
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
