import { ShoppingCartListItem } from '@/components/features/shoppingCart/ShoppingCartListItem';
import { PageContent, PageSection } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, CustomText } from '@/components/ui';
import { routes } from '@/config/routes';
import { useTheme } from '@/contexts';
import { useShoppingCart } from '@/contexts/ShoppingCartProvider';
import { FONT_SIZES, SPACING } from '@/styles';
import { StyleVariant } from '@/types';
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
    const { themeManager } = useTheme();
    const themeVariant = themeManager.getVariant('secondary');
    const styles = createStyles(themeVariant);

    return (
        <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
                <CustomText bold fontSize='lg' style={styles.totalText}>Antall: {cartItemCount}</CustomText>
                <CustomText bold fontSize='lg' style={styles.totalText}>Total: {formatPrice(cartTotal)}</CustomText>
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
    const { items, cartTotal, updateQuantity, removeFromCart, clearCart } = useShoppingCart();
    const { themeManager } = useTheme();
    const themeVariant = themeManager.getVariant('default');
    const styles = createStyles(themeVariant);

    const renderItem = useCallback(({ item }: { item: any }) => (
        <ShoppingCartListItem
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
        />
    ), [updateQuantity, removeFromCart]);


    return (
        <PageContent>
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
                    <ShoppingCartSummary cartItemCount={items.length} cartTotal={cartTotal} onClearCart={clearCart} />
                )}
            </PageSection>
        </PageContent >
    );
}

const createStyles = (themeVariant: StyleVariant) => StyleSheet.create({
    cartSection: {
        paddingHorizontal: 0,
    },
    summaryContainer: {
        padding: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: themeVariant.borderColor,
        backgroundColor: themeVariant.backgroundColor,
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
        color: themeVariant.text.secondary,
    },
});
