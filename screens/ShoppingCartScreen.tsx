import { PageSection, PageView } from '@/components/layout';
import { Button, CustomText, Icon } from '@/components/ui';
import { routes } from '@/config/routing';
import { useTheme } from '@/contexts';
import { useShoppingCart } from '@/contexts/ShoppingCartProvider';
import { SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';
import { ShoppingCartItem, Theme } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { Stack } from 'expo-router';
import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';

interface ShoppingCartListItemProps {
    item: ShoppingCartItem;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
}

const ShoppingCartListItem = memo(({ item, onUpdateQuantity, onRemove }: ShoppingCartListItemProps) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);


    return (
        <View style={styles.cartItem}>
            <Pressable onPress={() => routes.product(item.product)} style={styles.productPressable}>
                <Image source={{ uri: item.product.images[0].src }} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <CustomText bold>{item.product.name}</CustomText>
                    <CustomText size="sm" style={styles.productPrice}>{formatPrice(item.product.price)}</CustomText>
                </View>
            </Pressable>

            <View style={styles.quantityContainer}>
                <Pressable
                    onPress={() => item.quantity > 1 && onUpdateQuantity(item.product.id, item.quantity - 1)}
                    style={item.quantity === 1 ? theme.styles.disabled : undefined}
                >
                    <Icon name="removeFromCart" color={theme.textOnColor.accent} />
                </Pressable>
                <CustomText bold style={styles.quantity}>{item.quantity}</CustomText>
                <Pressable onPress={() => onUpdateQuantity(item.product.id, item.quantity + 1)}>
                    <Icon name="addToCart" color={theme.textOnColor.accent} />
                </Pressable>
            </View>
            <Pressable onPress={() => onRemove(item.product.id)} style={{ marginLeft: SPACING.md }}>
                <Icon name="emptyCart" color={theme.textOnColor.accent} />
            </Pressable>
        </View>
    );
});

interface ShoppingCartSummaryProps {
    cartItemCount: number;
    cartTotal: number;
}

const ShoppingCartSummary = memo(({ cartItemCount, cartTotal }: ShoppingCartSummaryProps) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
                <CustomText bold size='lg' style={styles.totalText}>Antall: {cartItemCount}</CustomText>
                <CustomText bold size='lg' style={styles.totalText}>Total: {formatPrice(cartTotal)}</CustomText>
            </View>
            <Button title="Gå til kassen" icon="checkout" onPress={() => { /* TODO: Implement checkout */ }} />
        </View>
    );
});


export const ShoppingCartScreen = () => {
    const { items, updateQuantity, removeFromCart, cartTotal, cartItemCount } = useShoppingCart();
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const renderItem = useCallback(({ item }: { item: ShoppingCartItem }) => (
        <ShoppingCartListItem
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
        />
    ), [updateQuantity, removeFromCart]);


    return (
        <PageView>
            <Stack.Screen options={{ title: 'Handlekurv' }} />
            <PageSection primary>
                <CustomText size="lg">Handlekurv</CustomText>
            </PageSection>
            <PageSection flex style={styles.cartSection}>
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.product.id.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={<CustomText style={styles.emptyText}>Handlekurven er tom.</CustomText>}
                />
                {items.length > 0 && (
                    <ShoppingCartSummary cartItemCount={cartItemCount} cartTotal={cartTotal} />
                )}
            </PageSection>

        </PageView >
    );
}

const createStyles = (theme: Theme) => StyleSheet.create({
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    productPressable: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cartSection: {
        paddingHorizontal: 0
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

    productPrice: {
        color: theme.colors.textSecondary,
        marginTop: 5,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantity: {
        marginHorizontal: SPACING.md,
    },
    summaryContainer: {
        padding: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.card,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalText: {
        textAlign: 'right',
        marginBottom: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: FONT_SIZES.md,
        color: theme.colors.textSecondary,
    },
});
