import { CartSummary } from '@/components/features/cart';
import { CartListItem } from '@/components/features/cart/CartListItem';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { ThemedText } from '@/components/ui/ThemedText';
import { useCart } from '@/contexts/CartContext';
import { FlashList } from '@shopify/flash-list';
import { ArrowBigRight } from '@tamagui/lucide-icons';
import React from 'react';
import { YStack } from 'tamagui';

export const CartScreen = () => {
    const { cart } = useCart();

    if (!cart) {
        return <ThemedSpinner />
    }

    return <PageView>
        <PageHeader theme="secondary_soft" bbw={2} boc={"black"}>
            <CartSummary />
        </PageHeader>
        <PageSection theme="primary_soft" p="$3">
            <FlashList
                data={cart.items}
                renderItem={({ item }) => <CartListItem item={item} />}
                ListEmptyComponent={<YStack f={1} ai="center" jc="center">
                    <ThemedText fos="$3">Handlekurven er tom</ThemedText>
                </YStack>}
                estimatedItemSize={100}
            />
        </PageSection>

        <PageContent>
            <YStack p="$4">
                <ThemedButton size="$6" iconAfter={ArrowBigRight}>
                    Gå til kassen
                </ThemedButton>
            </YStack>
        </PageContent>
    </PageView>
};
