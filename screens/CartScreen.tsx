import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { useCart } from '@/contexts/CartContext';
import { ArrowBigRight } from '@tamagui/lucide-icons';
import React from 'react';
import { SizableText, YStack } from 'tamagui';

export const CartScreen = () => {
    const { itemsCount } = useCart();

    if (itemsCount === 0) {
        return (
            <YStack f={1} ai="center" jc="center">
                <ThemedText fos="$3">Handlekurven er tom</ThemedText>
            </YStack>
        );
    }

    return <PageView>
        <PageHeader theme="secondary_soft" bbw={2} boc={"black"}>
            <ThemedText>{itemsCount}</ThemedText>
        </PageHeader>
        <PageSection theme="primary_soft" p="$3"><SizableText>aaa</SizableText>
            {/*    <FlashList
                data={items}
                renderItem={({ item }) => <ShoppingCartListItem item={item} />}
                estimatedItemSize={100}
            /> */}
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
