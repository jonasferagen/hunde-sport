import { CheckoutListItem } from '@/components/features/checkout/CheckoutListItem';
import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { checkoutFlow } from '@/config/routes';
import { useOrderContext } from '@/contexts/OrderContext';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { OrderLineItem } from '@/models/Order';
import { ShoppingCartItem } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { FlashList } from '@shopify/flash-list';
import { ArrowBigRight } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect, useState } from 'react';
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

export const PaymentScreen = () => {
    const router = useRouter();
    const { items: cartItems, cartTotal } = useShoppingCartContext();
    const { order, updateOrder, placeOrder } = useOrderContext();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const title = 'Betaling';

    const renderItem = useCallback(
        ({ item }: { item: ShoppingCartItem }) => <CheckoutListItem item={item} />,
        []
    );

    // Finalize the order details when the user enters the payment screen
    useEffect(() => {
        if (cartItems.length === 0) return;

        const line_items: OrderLineItem[] = cartItems.map((item) => {
            const lineItem: OrderLineItem = {
                product_id: item.purchasable.product.id,
                quantity: item.quantity,
            };

            if (item.purchasable.productVariation?.id) {
                lineItem.variation_id = item.purchasable.productVariation.id;
            }

            return lineItem;
        });

        updateOrder({
            line_items,
            payment_method: 'svea_checkout',
        });
    }, [cartItems, updateOrder]);

    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);
        const paymentUrl = await placeOrder();
        if (paymentUrl) {
            await WebBrowser.openBrowserAsync(paymentUrl);
            // Optionally, you can clear the cart or navigate the user
            // after they return from the web browser.
        }
        setIsPlacingOrder(false);
    };

    return (
        <PageView>
            <PageHeader padding="none">
                <RouteTrail steps={checkoutFlow} currentStepName="payment" />
            </PageHeader>
            <PageSection flex={1}>
                <PageContent flex={1} paddingHorizontal='none'>
                    <FlashList
                        data={cartItems}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.key}
                        estimatedItemSize={60}
                        ListHeaderComponent={CheckoutListHeader}
                        ListFooterComponent={<CheckoutListFooter total={cartTotal} />}
                    />
                </PageContent>
                {order.billing && (
                    <PageContent>
                        <YStack gap="$2" paddingVertical="$4">
                            <SizableText fontWeight="bold" fontSize="$4">Faktureringsadresse</SizableText>
                            <SizableText>{order.billing.first_name} {order.billing.last_name}</SizableText>
                            <SizableText>{order.billing.address_1}</SizableText>
                            <SizableText>{order.billing.postcode} {order.billing.city}</SizableText>
                            <SizableText>{order.billing.email}</SizableText>
                            <SizableText>{order.billing.phone}</SizableText>
                        </YStack>
                    </PageContent>
                )}
                <PageContent theme="secondary_soft">
                    <XStack gap="$3" mt="$3" ai="center" jc="space-between">
                        <ThemedButton
                            onPress={handlePlaceOrder}
                            disabled={!order.isValid() || isPlacingOrder}
                            scaleIcon={1.5}
                            flex={1}
                            jc="space-between"
                            theme="primary"
                        >
                            {isPlacingOrder ? 'Plasserer ordre...' : 'Bekreft'}
                            <XStack ai="center">
                                <ArrowBigRight size="$4" />
                            </XStack>
                        </ThemedButton>
                    </XStack>
                </PageContent>
            </PageSection>
        </PageView>
    );
};
