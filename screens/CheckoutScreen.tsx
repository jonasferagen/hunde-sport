import { CheckoutList } from '@/components/features/checkout/CheckoutList';
import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { checkoutFlow, routes } from '@/config/routes';
import { useShoppingCartContext } from '@/contexts/ShoppingCartContext';
import { Stack, useRouter } from 'expo-router';
import React, { JSX } from 'react';
import { Button } from 'tamagui';

export const CheckoutScreen = (): JSX.Element => {
    const { items, cartTotal } = useShoppingCartContext();
    const router = useRouter();

    const title = 'Ordreoversikt';

    return (
        <PageView>
            <Stack.Screen options={{ title }} />
            <PageHeader>
                <RouteTrail steps={checkoutFlow} currentStepName="checkout" />
            </PageHeader>
            <PageSection flex>
                <PageContent flex>
                    <CheckoutList items={items} cartTotal={cartTotal} />
                </PageContent>
                <PageContent>
                    <Button theme="primary" onPress={() => router.push(routes.billing())}>
                        Gå til levering
                    </Button>
                </PageContent>
            </PageSection>
        </PageView>
    );
};
