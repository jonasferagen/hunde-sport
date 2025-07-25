import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { checkoutFlow, routes } from '@/config/routes';
import { useOrderContext } from '@/contexts/OrderContext';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { OrderLineItem } from '@/models/Order';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, SizableText } from 'tamagui';

const PaymentScreen = () => {
    const router = useRouter();
    const { items: cartItems } = useShoppingCartContext();
    const { order, updateOrder, placeOrder } = useOrderContext();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const title = 'Betaling';

    // Finalize the order details when the user enters the payment screen
    useEffect(() => {
        const line_items: OrderLineItem[] = cartItems.map((item) => {
            const lineItem: OrderLineItem = {
                product_id: item.product.id,
                quantity: item.quantity,
            };

            if (item.productVariation?.id) {
                lineItem.variation_id = item.productVariation.id;
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
        const success = await placeOrder();
        if (success) {
            router.push(routes.orderStatus());
        }
        setIsPlacingOrder(false);
    };

    return (
        <PageView>
            <Stack.Screen options={{ title }} />
            <PageHeader>
                <RouteTrail steps={checkoutFlow} currentStepName="payment" />
            </PageHeader>
            <PageSection flex={1}>
                <PageContent flex={1}>
                    <SizableText>Betalingsinformasjon kommer her.</SizableText>
                </PageContent>
                <PageContent>
                    <Button onPress={handlePlaceOrder} disabled={!order.isValid() || isPlacingOrder}>
                        {isPlacingOrder ? 'Plasserer ordre...' : 'Svea Checkout'}
                    </Button>
                </PageContent>
            </PageSection>
        </PageView>
    );
};

export default PaymentScreen;
