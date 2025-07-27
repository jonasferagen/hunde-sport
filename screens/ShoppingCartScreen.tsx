import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader as OriginalPageHeader } from '@/components/layout/PageHeader';

import { DebugSeeder } from '@/components/development/DebugSeeder';
import { ShoppingCartListItem } from '@/components/features/cart/ShoppingCartListItem';
import { ProductCardImage } from '@/components/features/product/card';
import { routes } from '@/config/routes';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { Product, ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { Stack, useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { SectionList } from 'react-native';
import { Button, H5, SizableText, XStack, YStack } from 'tamagui';

interface ShoppingCartSummaryProps {
    cartItemCount: number;
    cartTotal: number;
    onClearCart: () => void;
}

const ShoppingCartSummary = memo(({ cartItemCount, cartTotal, onClearCart }: ShoppingCartSummaryProps) => {
    return (
        <>
            <XStack jc="space-between" ai="center">
                <SizableText fontWeight="bold" size="$6" textAlign="right">
                    Antall: {cartItemCount}
                </SizableText>
                <SizableText fontWeight="bold" size="$6" textAlign="right">
                    Total: {formatPrice(cartTotal)}
                </SizableText>
            </XStack>
            <YStack gap="$3" mt="$3">
                <Button onPress={onClearCart} theme="secondary">
                    Tøm handlekurv
                </Button>
                <Button onPress={() => useRouter().push(routes.shipping())} theme="primary" disabled={cartItemCount === 0}>
                    Gå til kassen
                </Button>
            </YStack>
        </>
    );
});

const ShoppingCartGroupHeader = ({ product }: { product: Product }) => {
    return (
        <PageContent>
            <XStack gap="$3" ai="center">
                <ProductCardImage product={product} imageSize={60} />
                <H5>{product.name}</H5>
            </XStack>
        </PageContent>
    );
};

export const ShoppingCartScreen = () => {
    const { groupedItems, cartTotal, cartItemCount, clearCart } = useShoppingCartContext();
    const router = useRouter();

    const renderItem = useCallback(
        ({ item }: { item: ShoppingCartItem }) => <ShoppingCartListItem item={item} />,
        []
    );

    const renderSectionHeader = useCallback(
        ({ section: { product } }: { section: { product: Product } }) => <ShoppingCartGroupHeader product={product} />,
        []
    );

    const sections = groupedItems.map(group => ({ product: group.product, data: group.items }));

    return (
        <PageView>
            <Stack.Screen options={{ title: 'Handlekurv' }} />
            <OriginalPageHeader title="Handlekurv" />
            <PageSection flex={1}>
                <PageContent paddingHorizontal="none" paddingVertical="none" flex={1}>
                    <SectionList
                        sections={sections}
                        keyExtractor={(item) => item.key}
                        renderItem={renderItem}
                        renderSectionHeader={renderSectionHeader}
                        ListEmptyComponent={
                            <SizableText textAlign="center" marginTop="$4" color="$color.secondary">
                                Handlekurven er tom.
                            </SizableText>
                        }
                    />
                </PageContent>
                <PageContent secondary>
                    <ShoppingCartSummary cartItemCount={cartItemCount} cartTotal={cartTotal} onClearCart={clearCart} />
                    <DebugSeeder />
                </PageContent>
            </PageSection>
        </PageView>
    );
};

interface CartTotalsProps {
    cartTotal: number;
}

const CartTotals = ({ cartTotal }: CartTotalsProps) => {
    return (
        <XStack jc="space-between" ai="center" paddingVertical="$4">
            <SizableText size="$6" fontWeight="bold">Total</SizableText>
            <SizableText size="$6" fontWeight="bold">{formatPrice(cartTotal)}</SizableText>
        </XStack>
    );
};