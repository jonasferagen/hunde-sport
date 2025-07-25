
import { ShoppingCartListItem } from '@/components/features/shoppingCart/ShoppingCartListItem';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader as OriginalPageHeader } from '@/components/layout/PageHeader';

import { DebugSeeder } from '@/components/development/DebugSeeder';
import { routes } from '@/config/routes';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { Stack, useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { FlatList } from 'react-native';
import { Button, SizableText, XStack, YStack } from 'tamagui';

interface ShoppingCartSummaryProps {
    cartItemCount: number;
    cartTotal: number;
    onClearCart: () => void;
}

const ShoppingCartSummary = memo(({ cartItemCount, cartTotal, onClearCart }: ShoppingCartSummaryProps) => {
    return (
        <>
            <XStack jc="space-between" ai="center">
                <SizableText fontWeight="bold" size="$6" textAlign="right">
                    Antall: {cartItemCount}
                </SizableText>
                <SizableText fontWeight="bold" size="$6" textAlign="right">
                    Total: {formatPrice(cartTotal)}
                </SizableText>
            </XStack>
            <YStack gap="$3" mt="$3">
                <Button onPress={onClearCart} theme="secondary">
                    Tøm handlekurv
                </Button>
                <Button onPress={() => useRouter().push(routes.shipping())} theme="primary">
                    Gå til kassen
                </Button>
            </YStack>
        </>
    );
});

export const ShoppingCartScreen = () => {
    const { items, cartTotal, cartItemCount, clearCart } = useShoppingCartContext();
    const router = useRouter();

    const renderItem = useCallback(
        ({ item }: { item: ShoppingCartItem }) => <ShoppingCartListItem item={item} />,
        []
    );

    return (
        <PageView>
            <Stack.Screen options={{ title: 'Handlekurv' }} />
            <OriginalPageHeader title="Handlekurv" />
            <PageSection flex={1}>
                <PageContent paddingHorizontal="none" paddingVertical="none" flex={1}>
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.key}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <SizableText textAlign="center" marginTop="$4" color="$color.secondary">
                                Handlekurven er tom.
                            </SizableText>
                        }
                    />
                </PageContent>
                <PageContent secondary>
                    <ShoppingCartSummary cartItemCount={cartItemCount} cartTotal={cartTotal} onClearCart={clearCart} />
                </PageContent>
                <PageContent>
                    <CartTotals cartTotal={cartTotal} />
                    <Button onPress={() => router.push(routes.shipping())} disabled={cartItemCount === 0}>
                        Gå til kassen
                    </Button>
                    <DebugSeeder />
                </PageContent>
            </PageSection>
        </PageView>
    );
};

interface CartTotalsProps {
    cartTotal: number;
}

const CartTotals = ({ cartTotal }: CartTotalsProps) => {
    return (
        <XStack jc="space-between" ai="center" paddingVertical="$4">
            <SizableText size="$6" fontWeight="bold">Total</SizableText>
            <SizableText size="$6" fontWeight="bold">{formatPrice(cartTotal)}</SizableText>
        </XStack>
    );
};