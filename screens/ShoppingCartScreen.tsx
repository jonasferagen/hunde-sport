import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';

import { DebugSeeder } from '@/components/development/DebugSeeder';
import { ShoppingCartListItem, ShoppingCartSummary } from '@/components/features/shoppingCart';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { routes } from '@/config/routes';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { ShoppingCartItem } from '@/types';
import { FlashList } from '@shopify/flash-list';
import { ArrowBigRight } from '@tamagui/lucide-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { SizableText, XStack } from 'tamagui';
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
            <PageHeader title="Handlekurv">
                <DebugSeeder />
            </PageHeader>
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
                    <ShoppingCartSummary cartItemCount={cartItemCount} cartTotal={cartTotal} />
                    <XStack gap="$3" mt="$3" ai="center" jc="space-between">
                        <ThemedButton flex={0} onPress={clearCart} theme="secondary" disabled={cartItemCount === 0}>
                            Tøm handlekurv
                        </ThemedButton>
                        <ThemedButton scaleIcon={1.5} iconAfter={ArrowBigRight} flex={1} onPress={handleCheckout} theme="primary" disabled={cartItemCount === 0}>
                            Til kassen
                        </ThemedButton>
                    </XStack>

                </PageContent>
            </PageSection>
        </PageView>
    );
};

