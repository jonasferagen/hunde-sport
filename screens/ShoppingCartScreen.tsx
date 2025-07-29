import { PageContent, PageSection, PageView } from '@/components/layout';

import { ShoppingCartListItem, ShoppingCartSummary } from '@/components/features/shoppingCart';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { routes } from '@/config/routes';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { ShoppingCartItem } from '@/types';
import { FlashList } from '@shopify/flash-list';
import { ArrowBigRight } from '@tamagui/lucide-icons';
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
            router.push(routes.shipping.path());
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
