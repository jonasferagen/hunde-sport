import { PageContent, PageSection, PageView } from '@/components/layout';

import { ShoppingCartListItem, ShoppingCartSummary } from '@/components/features/shopping-cart';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { routes } from '@/config/routes';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { ShoppingCartItem } from '@/types';
import { FlashList } from '@shopify/flash-list';
import { ArrowBigRight, ShoppingCart, X } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { XStack, YStack } from 'tamagui';


export const ShoppingCartScreen = () => {
    const { items, cartTotal, cartItemCount, clearCart } = useShoppingCartContext();

    const renderItem = useCallback(
        ({ item }: { item: ShoppingCartItem }) => <ShoppingCartListItem item={item} />,
        []
    );
    const router = useRouter();

    const handleCheckout = () => {
        if (items.length > 0) {
            router.push(routes.checkout.path());
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
                <PageContent paddingHorizontal="none" paddingVertical="none" flex={1}>
                    <FlashList
                        data={items}
                        keyExtractor={(item) => item.key}
                        renderItem={renderItem}
                        estimatedItemSize={100}
                    />
                </PageContent>
                <PageContent theme='secondary'>
                    <ShoppingCartSummary cartItemCount={cartItemCount} cartTotal={cartTotal} />
                    <XStack gap="$3" mt="$3" ai="center" jc="space-between">
                        <ThemedButton onPress={clearCart} ai="center" flex={1} theme="secondary" disabled={cartItemCount === 0}>
                            <X size="$4" /> Tøm handlekurv
                        </ThemedButton>
                        <ThemedButton onPress={handleCheckout} scaleIcon={1.5} flex={1} jc="space-between" theme="primary" disabled={cartItemCount === 0}>
                            Til kassen <XStack ai="center"><ShoppingCart size="$4" /><ArrowBigRight size="$3" /></XStack>
                        </ThemedButton>
                    </XStack>
                </PageContent>
            </PageSection>
        </PageView>
    );
};
