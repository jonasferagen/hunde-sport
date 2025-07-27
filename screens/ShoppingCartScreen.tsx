import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader as OriginalPageHeader } from '@/components/layout/PageHeader';

import { DebugSeeder } from '@/components/development/DebugSeeder';
import { ShoppingCartListItem, ShoppingCartSummary } from '@/components/features/shoppingCart';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { routes } from '@/config/routes';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { ShoppingCartItem } from '@/types';
import { FlashList } from '@shopify/flash-list';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { SizableText, YStack } from 'tamagui';

export const ShoppingCartScreen = () => {
    const { items, cartTotal, cartItemCount, clearCart } = useShoppingCartContext();

    const renderItem = useCallback(
        ({ item }: { item: ShoppingCartItem }) => <ShoppingCartListItem item={item} />,
        []
    );
    const router = useRouter();

    const handleCheckout = () => {
        router.push(routes.shipping());
    };

    return (
        <PageView>
            <Stack.Screen options={{ title: 'Handlekurv' }} />
            <OriginalPageHeader title="Handlekurv" />
            <PageSection flex={1}>
                <PageContent paddingHorizontal="none" paddingVertical="none" flex={1}>
                    <FlashList
                        data={items}
                        keyExtractor={(item) => item.key}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <SizableText textAlign="center" marginTop="$4">
                                Handlekurven er tom.
                            </SizableText>
                        }
                        estimatedItemSize={100}
                    />
                </PageContent>
                <PageContent secondary>
                    <ShoppingCartSummary cartItemCount={cartItemCount} cartTotal={cartTotal} onClearCart={clearCart} />
                    <YStack gap="$3" mt="$3">
                        <ThemedButton onPress={handleCheckout} theme="primary" disabled={cartItemCount === 0}>
                            Gå til kassen
                        </ThemedButton>
                        <ThemedButton onPress={clearCart} theme="secondary">
                            Tøm handlekurv
                        </ThemedButton>
                    </YStack>
                    <DebugSeeder />
                </PageContent>
            </PageSection>
        </PageView>
    );
};

