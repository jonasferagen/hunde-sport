import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';


import { ShoppingCartListItem, ShoppingCartSummary } from '@/components/features/shopping-cart';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedText } from '@/components/ui/ThemedText';

import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { ShoppingCartItem } from '@/types';
import { FlashList } from '@shopify/flash-list';
import { ArrowBigRight, ShoppingCart } from '@tamagui/lucide-icons';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback } from 'react';
import { XStack, YStack } from 'tamagui';

export const ShoppingCartScreen = () => {
    const { items, cartTotal, cartItemCount, clearCart } = useShoppingCartContext();

    const renderItem = useCallback(
        ({ item }: { item: ShoppingCartItem }) => <ShoppingCartListItem item={item} />,
        []
    );

    const handleCheckout = async () => {
        if (items.length > 0) {
            try {
                const itemsQuery = items
                    .map((item) => {
                        const idToAdd = item.purchasable.productVariation?.id || item.purchasable.product.id;
                        return `${idToAdd}:${item.quantity}`;
                    })
                    .join(',');

                const url = `https://hunde-sport.no/kassen?cart_fill=1&items=${itemsQuery}`;

                await WebBrowser.openBrowserAsync(url);
            } catch (error) {
                console.error(error);
            }
        }
    };


    if (cartItemCount === 0) {
        return (
            <YStack flex={1} ai="center" jc="center">
                <ThemedText fontSize="$3">Handlekurven er tom</ThemedText>
            </YStack>
        );
    }


    return (
        <PageView>
            <PageSection flex={1}>
                <PageHeader theme="secondary_soft">
                    <ShoppingCartSummary cartItemCount={cartItemCount} cartTotal={cartTotal} />
                </PageHeader>

                <PageContent paddingHorizontal="none" paddingVertical="none" flex={1}>

                    <FlashList
                        data={items}
                        keyExtractor={(item) => item.key}
                        renderItem={renderItem}
                        estimatedItemSize={100}
                    />

                </PageContent>
                <PageContent theme='secondary_soft'>
                    <XStack gap="$3" ai="center" jc="space-between">
                        <ThemedButton onPress={handleCheckout} scaleIcon={1.5} flex={1} jc="space-between" theme="primary" disabled={cartItemCount === 0}>
                            Til kassen <XStack ai="center"><ShoppingCart size="$4" /><ArrowBigRight size="$3" /></XStack>
                        </ThemedButton>
                    </XStack>
                </PageContent>
            </PageSection>
        </PageView>
    );
};
