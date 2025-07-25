import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { checkoutFlow, routes } from '@/config/routes';
import { useOrderContext } from '@/contexts/OrderContext';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { OrderLineItem } from '@/models/Order';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Button, SizableText } from 'tamagui';

const PaymentScreen = () => {
    const router = useRouter();
    const { items: cartItems } = useShoppingCartContext();
    const { updateOrder } = useOrderContext();
    const title = 'Betaling';

    const handleNext = () => {
        const line_items: OrderLineItem[] = cartItems.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            variation_id: item.productVariation?.id || 0,
        }));

        updateOrder({ line_items });

        router.push(routes.orderStatus());
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
                    <Button onPress={handleNext}>Fullfør Kjøp</Button>
                </PageContent>
            </PageSection>
        </PageView>
    );
};

export default PaymentScreen;
