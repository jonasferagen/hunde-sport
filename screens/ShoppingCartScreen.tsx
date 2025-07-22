import { ShoppingCartListItem } from '@/components/features/shoppingCart/ShoppingCartListItem';
import { PageContent, PageSection, PageView } from '@/components/layout';
import { PageHeader } from '@/components/layout/PageHeader';
import { CustomText } from '@/components/ui';
import { StyledButton, StyledButtonText } from '@/components/ui/button/StyledButton';
import { routes } from '@/config/routes';
import { useThemeContext } from '@/contexts';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { IStyleVariant, ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { Stack, useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { YStack } from 'tamagui';

interface ShoppingCartSummaryProps {
    cartItemCount: number;
    cartTotal: number;
    onClearCart: () => void;
}

const ShoppingCartSummary = memo(({ cartItemCount, cartTotal, onClearCart }: ShoppingCartSummaryProps) => {
    const { themeManager } = useThemeContext();
    const themeVariant = themeManager.getVariant('secondary');
    const styles = createStyles(themeVariant);

    return (
        <>
            <View style={styles.summaryRow}>
                <CustomText bold fontSize="lg" style={styles.totalText}>
                    Antall: {cartItemCount}
                </CustomText>
                <CustomText bold fontSize="lg" style={styles.totalText}>
                    Total: {formatPrice(cartTotal)}
                </CustomText>
            </View>
            <YStack gap="$3" mt="$3">
                <StyledButton
                    onPress={onClearCart}
                    variant="secondary"
                >
                    <StyledButtonText variant="secondary">Tøm handlekurv</StyledButtonText>
                </StyledButton>
                <StyledButton
                    onPress={() => useRouter().push(routes.checkout())}
                    variant="primary"
                >
                    <StyledButtonText variant="primary">Gå til kassen</StyledButtonText>
                </StyledButton>
            </YStack>
        </>
    );
});

export const ShoppingCartScreen = () => {
    const { items, cartTotal, cartItemCount, clearCart } = useShoppingCartContext();
    const { themeManager } = useThemeContext();
    const themeVariant = themeManager.getVariant('default');
    const styles = createStyles(themeVariant);
    const router = useRouter();

    const renderItem = useCallback(
        ({ item }: { item: ShoppingCartItem }) => <ShoppingCartListItem item={item} />,
        []
    );

    return (
        <PageView>
            <Stack.Screen options={{ title: 'Handlekurv' }} />
            <PageHeader title="Handlekurv" />
            <PageSection flex>
                <PageContent paddingHorizontal="none" paddingVertical="none" flex>
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.baseProduct.id.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={<CustomText style={styles.emptyText}>Handlekurven er tom.</CustomText>}
                    />
                </PageContent>
                <PageContent secondary>
                    <ShoppingCartSummary cartItemCount={cartItemCount} cartTotal={cartTotal} onClearCart={clearCart} />
                </PageContent>
            </PageSection>
        </PageView>
    );
};

const createStyles = (themeVariant: IStyleVariant) =>
    StyleSheet.create({
        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        totalText: {
            textAlign: 'right',
        },
        emptyText: {
            textAlign: 'center',
            marginTop: 50,
            color: themeVariant.text.secondary,
        },
    });
