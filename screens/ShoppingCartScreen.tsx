import { ShoppingCartListItem } from '@/components/features/shoppingCart/ShoppingCartListItem';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { StyledButton, StyledButtonText } from '@/components/ui/button/StyledButton';
import { routes } from '@/config/routes';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { Stack, useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { FlatList } from 'react-native';
import { SizableText, XStack, YStack } from 'tamagui';

interface ShoppingCartSummaryProps {
    cartItemCount: number;
    cartTotal: number;
    onClearCart: () => void;
}

const ShoppingCartSummary = memo(({ cartItemCount, cartTotal, onClearCart }: ShoppingCartSummaryProps) => {
    return (
        <>
            <XStack justifyContent="space-between" alignItems="center">
                <SizableText fontWeight="bold" size="$6" textAlign="right">
                    Antall: {cartItemCount}
                </SizableText>
                <SizableText fontWeight="bold" size="$6" textAlign="right">
                    Total: {formatPrice(cartTotal)}
                </SizableText>
            </XStack>
            <YStack gap="$3" mt="$3">
                <StyledButton onPress={onClearCart} variant="secondary">
                    <StyledButtonText variant="secondary">Tøm handlekurv</StyledButtonText>
                </StyledButton>
                <StyledButton onPress={() => useRouter().push(routes.checkout())} variant="primary">
                    <StyledButtonText variant="primary">Gå til kassen</StyledButtonText>
                </StyledButton>
            </YStack>
        </>
    );
});

export const ShoppingCartScreen = () => {
    const { items, cartTotal, cartItemCount, clearCart } = useShoppingCartContext();

    const renderItem = useCallback(
        ({ item }: { item: ShoppingCartItem }) => <ShoppingCartListItem item={item} />,
        []
    );

    return (
        <PageView>
            <Stack.Screen options={{ title: 'Handlekurv' }} />
            <PageHeader title="Handlekurv" />
            <PageSection flex={1}>
                <PageContent paddingHorizontal="none" paddingVertical="none" flex={1}>
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.baseProduct.id.toString() + (item.selectedVariant?.id?.toString() || '')}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <SizableText textAlign="center" marginTop="$4" color="$color.secondary">
                                Handlekurven er tom.
                            </SizableText>
                        }
                    />
                </PageContent>
                <PageContent secondary>
                    <ShoppingCartSummary cartItemCount={cartItemCount} cartTotal={cartTotal} onClearCart={clearCart} />
                </PageContent>
            </PageSection>
        </PageView>
    );
};
