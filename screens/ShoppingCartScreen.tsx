import { ShoppingCartListItem } from '@/components/features/shoppingCart/ShoppingCartListItem';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, CustomText } from '@/components/ui';
import { routes } from '@/config/routes';
import { useTheme } from '@/contexts';
import { useShoppingCart } from '@/contexts/ShoppingCartProvider';
import { FONT_SIZES, SPACING } from '@/styles';
import { IStyleVariant } from '@/types';
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
        <>
            <View style={styles.summaryRow}>
                <CustomText bold fontSize='lg' style={styles.totalText}>Antall: {cartItemCount}</CustomText>
                <CustomText bold fontSize='lg' style={styles.totalText}>Total: {formatPrice(cartTotal)}</CustomText>
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Tøm handlekurv" icon="emptyCart" variant="secondary" onPress={onClearCart} />
                <Link href={routes.checkout()} asChild>
                    <Button title="Gå til kassen" icon="next" variant="primary" />
                </Link>
            </View>
        </>
    );
});

export const ShoppingCartScreen = () => {
    const { items, cartTotal, cartItemCount, updateQuantity, removeFromCart, clearCart } = useShoppingCart();
    const { themeManager } = useTheme();
    const themeVariant = themeManager.getVariant('default');
    const styles = createStyles(themeVariant);

    const renderItem = useCallback(({ item, index }: { item: any, index: number }) => (
        <ShoppingCartListItem
            item={item}
            index={index}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
        />
    ), [updateQuantity, removeFromCart]);


    return (
        <PageView>
            <Stack.Screen options={{ title: 'Handlekurv' }} />
            <PageHeader title="Handlekurv" />
            <PageSection flex>
                <PageContent padding="none" flex >
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.product.id.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={<CustomText style={styles.emptyText}>Handlekurven er tom.</CustomText>}
                    />
                </PageContent>
                <PageContent secondary>
                    <ShoppingCartSummary cartItemCount={cartItemCount} cartTotal={cartTotal} onClearCart={clearCart} />
                </PageContent>
            </PageSection >
        </PageView>

    );
}

const createStyles = (themeVariant: IStyleVariant) => StyleSheet.create({

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
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: FONT_SIZES.md,
        color: themeVariant.text.secondary,
    },
});
