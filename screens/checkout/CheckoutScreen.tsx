import { CheckoutListItem } from '@/components/features/checkout/CheckoutListItem';
import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { checkoutFlow, routes } from '@/config/routes';
import { useShoppingCartContext } from '@/contexts';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { FlashList } from '@shopify/flash-list';
import { ArrowBigRightDash, Mailbox } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';

const CheckoutListHeader = () => (
    <XStack jc="space-between" ai="center" paddingHorizontal="$4" paddingVertical="$2" borderBottomWidth={1} borderColor="$gray8">
        <SizableText flex={2} fontWeight="bold" fontSize="$3">Vare</SizableText>
        <SizableText flex={1} textAlign="right" fontWeight="bold" fontSize="$3">Pris</SizableText>
        <SizableText flex={1} textAlign="center" fontWeight="bold" fontSize="$3">Antall</SizableText>
        <SizableText flex={1} textAlign="right" fontWeight="bold" fontSize="$3">Subtotal</SizableText>
    </XStack>
);

const CheckoutListFooter = ({ total }: { total: number }) => (
    <XStack jc="flex-end" ai="center" paddingHorizontal="$4" paddingVertical="$3" borderTopWidth={1} borderColor="$gray8" mt="$3">
        <SizableText fontSize="$5" fontWeight="bold">Total:</SizableText>
        <SizableText fontSize="$5" fontWeight="bold" width={120} textAlign="right">{formatPrice(total)}</SizableText>
    </XStack>
);

export const CheckoutScreen = () => {
    const { items, cartTotal } = useShoppingCartContext();

    const renderItem = useCallback(
        ({ item }: { item: ShoppingCartItem }) => <CheckoutListItem item={item} />,
        []
    );

    if (items.length === 0) {
        return (
            <YStack flex={1} ai="center" jc="center">
                <ThemedText fontSize="$3">Ingen varer i handlekurven.</ThemedText>
            </YStack>
        );
    }

    return (
        <PageView>
            <PageHeader padding="none">
                <RouteTrail steps={checkoutFlow} currentStepName="checkout" />
            </PageHeader>
            <PageSection flex={1}>
                <PageContent flex={1} paddingHorizontal='none' >
                    <FlashList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.key}
                        estimatedItemSize={60}
                        ListHeaderComponent={CheckoutListHeader}
                        ListFooterComponent={<CheckoutListFooter total={cartTotal} />}
                    />
                </PageContent>
            </PageSection>
            <PageContent theme='secondary'>

                <XStack gap="$3" mt="$3" ai="center" jc="space-between">

                    <ThemedButton jc="space-between" flex={1} onPress={() => router.push(routes.shipping.path())} theme="primary">
                        Levering <XStack ai="center"><ArrowBigRightDash size="$4" /><Mailbox size="$4" /></XStack>
                    </ThemedButton>
                </XStack>
            </PageContent>
        </PageView>
    );
};
