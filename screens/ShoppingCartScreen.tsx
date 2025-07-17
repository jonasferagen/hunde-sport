import { ShoppingCartListItem } from '@/components/features/cart/ShoppingCartListItem';
import { PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, CustomText } from '@/components/ui';
import { routes } from '@/config/routes';
import { useTheme } from '@/contexts';
import { useShoppingCart } from '@/contexts/ShoppingCartProvider';
import { SPACING } from '@/styles/Dimensions';
import { FONT_SIZES } from '@/styles/Typography';
import { ShoppingCartItem, Theme } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { Link, Stack } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

interface ShoppingCartSummaryProps {
    cartItemCount: number;
    cartTotal: number;
    onClearCart: () => void;
}

const ShoppingCartSummary = memo(({ cartItemCount, cartTotal, onClearCart }: ShoppingCartSummaryProps) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
                <CustomText bold size='lg' style={styles.totalText}>Antall: {cartItemCount}</CustomText>
                <CustomText bold size='lg' style={styles.totalText}>Total: {formatPrice(cartTotal)}</CustomText>
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Tøm handlekurv" icon="emptyCart" variant="secondary" onPress={onClearCart} />
                <Link href={routes.checkout()} asChild>
                    <Button title="Gå til kassen" icon="checkout" variant="primary" />
                </Link>
            </View>
        </View>
    );
});


export const ShoppingCartScreen = () => {
    const { items, updateQuantity, removeFromCart, cartTotal, cartItemCount, clearCart } = useShoppingCart();
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
            <PageHeader title="Handlekurv" />
            <PageSection flex style={styles.cartSection}>
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.product.id.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={<CustomText style={styles.emptyText}>Handlekurven er tom.</CustomText>}
                />
                {items.length > 0 && (
                    <ShoppingCartSummary cartItemCount={cartItemCount} cartTotal={cartTotal} onClearCart={clearCart} />
                )}
            </PageSection>
        </PageView >
    );
}

const createStyles = (theme: Theme) => StyleSheet.create({
    cartSection: {
        paddingHorizontal: 0,
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
    buttonContainer: {

        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: SPACING.md,
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
