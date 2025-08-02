import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';


import { ShoppingCartListItem, ShoppingCartSummary } from '@/components/features/shopping-cart';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedText } from '@/components/ui/ThemedText';

import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { FlashList } from '@shopify/flash-list';
import { ArrowBigRight, ShoppingCart } from '@tamagui/lucide-icons';
import React from 'react';
import { XStack, YStack } from 'tamagui';

export const ShoppingCartScreen = () => {
    const { cart } = useShoppingCartContext();


    if (!cart) {
        return null;
    }



    if (cart.items_count === 0) {
        return (
            <YStack flex={1} ai="center" jc="center">
                <ThemedText fontSize="$3">Handlekurven er tom</ThemedText>
            </YStack>
        );
    }



    return <PageView>
        <PageHeader theme="secondary_soft" f={0}>
            <ShoppingCartSummary cartItemCount={cart.items_count} cartTotal={0} />
        </PageHeader>
        <PageSection scrollable f={1} bg="blue">
            <PageContent theme="primary_soft" flex={1}>

                <FlashList
                    data={cart.items}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) => <ShoppingCartListItem item={item} />}
                    estimatedItemSize={100}
                    scrollEnabled={true}
                />
            </PageContent>
        </PageSection>
        <PageContent theme='secondary_soft' >
            <XStack gap="$3" ai="center" jc="space-between">
                <ThemedButton onPress={() => { console.log("checkout") }} scaleIcon={1.5} flex={1} jc="space-between" theme="primary" disabled={cart.items_count === 0}>
                    Til kassen <XStack ai="center"><ShoppingCart size="$4" /><ArrowBigRight size="$3" /></XStack>
                </ThemedButton>
            </XStack>
        </PageContent>
    </PageView >
};
