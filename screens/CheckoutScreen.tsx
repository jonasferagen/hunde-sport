import { CheckoutList } from '@/components/features/checkout/CheckoutList';
import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Button } from '@/components/ui/button/Button';
import { checkoutFlow, routes } from '@/config/routes';
import { useShoppingCart } from '@/contexts/ShoppingCartProvider';
import { Stack, useRouter } from 'expo-router';
import React, { JSX } from 'react';

export const CheckoutScreen = (): JSX.Element => {
    const { items, cartTotal } = useShoppingCart();
    const router = useRouter();

    const title = "Ordreoversikt";

    return (
        <PageView>
            <Stack.Screen options={{ title }} />
            <PageHeader title={title}>
                <RouteTrail steps={checkoutFlow} currentStepName="checkout" />
            </PageHeader>
            <PageSection flex>
                <PageContent flex>
                    <CheckoutList items={items} cartTotal={cartTotal} />
                </PageContent>
                <PageContent>
                    <Button title="Gå til fakturering" onPress={() => router.push(routes.billing())} />
                </PageContent>
            </PageSection>
        </PageView>
    );
};
