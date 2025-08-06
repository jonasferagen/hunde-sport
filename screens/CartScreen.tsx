import { CartSummary } from '@/components/features/cart';
import { CartListItem } from '@/components/features/cart/CartListItem';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { ThemedText } from '@/components/ui/ThemedText';
import { useCartContext } from '@/contexts/CartContext';
import { FlashList } from '@shopify/flash-list';
import { ExternalLink } from '@tamagui/lucide-icons';
import React from 'react';
import { YStack } from 'tamagui';

export const CartScreen = () => {
    const { cart } = useCartContext();

    if (!cart) {
        return <ThemedSpinner />
    }

    return <PageView>
        <PageHeader theme="secondary_soft">
            <CartSummary />
        </PageHeader>
        <PageSection theme="primary_soft">
            <FlashList
                data={cart.items}
                renderItem={({ item }) => <CartListItem item={item} />}
                ListEmptyComponent={
                    <YStack f={1} ai="center" jc="center">
                        <ThemedText fos="$3">Handlekurven er tom</ThemedText>
                    </YStack>}
                estimatedItemSize={100}
            />
        </PageSection>

        <PageContent>
            <YStack theme="primary">
                <ThemedButton
                    disabled={false}
                    jc="space-between"
                    variant="accent"
                    scaleIcon={1.5}
                    iconAfter={<ExternalLink />}
                    fontWeight="bold"
                    fontSize="$4"
                >
                    Til kassen
                </ThemedButton >
            </YStack>
        </PageContent>
    </PageView>
};
