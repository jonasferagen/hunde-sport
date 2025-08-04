import { ShoppingCartListItem, ShoppingCartSummary } from '@/components/features/shopping-cart';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { ThemedText } from '@/components/ui/ThemedText';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { FlashList } from '@shopify/flash-list';
import { ArrowBigRight } from '@tamagui/lucide-icons';
import React from 'react';
import { YStack } from 'tamagui';

export const ShoppingCartScreen = () => {
    const { isReady, items_count, items } = useShoppingCartContext();

    if (!isReady) {
        return <ThemedSpinner />;
    }

    if (items_count === 0) {
        return (
            <YStack f={1} ai="center" jc="center">
                <ThemedText fos="$3">Handlekurven er tom</ThemedText>
            </YStack>
        );
    }

    return <PageView>
        <PageHeader theme="secondary_soft" bbw={2} boc={"black"}>
            <ShoppingCartSummary />
        </PageHeader>
        <PageSection theme="primary_soft" p="$3">
            <FlashList
                data={items}
                renderItem={({ item }) => <ShoppingCartListItem item={item} />}
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
