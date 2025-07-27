import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader as OriginalPageHeader } from '@/components/layout/PageHeader';

import { DebugSeeder } from '@/components/development/DebugSeeder';
import { ShoppingCartListItem, ShoppingCartSummary } from '@/components/features/shoppingCart';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { Stack } from 'expo-router';
import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { SizableText, XStack } from 'tamagui';

export const ShoppingCartScreen = () => {
    const { items, cartTotal, cartItemCount, clearCart } = useShoppingCartContext();

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