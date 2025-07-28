import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { checkoutFlow } from '@/config/routes';
import { useOrderContext } from '@/contexts/OrderContext';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

const CheckoutScreen = () => {
    const router = useRouter();
    const { updateOrder, order } = useOrderContext();


    const title = 'Kasse';

    return (
        <PageView>
            <Stack.Screen options={{ title }} />
            <PageHeader>
                <RouteTrail steps={checkoutFlow} currentStepName="shipping" />
            </PageHeader>
            <PageSection flex={1}>
                <PageContent flex={1} paddingHorizontal='none' >
                    AAA
                </PageContent>
            </PageSection>
        </PageView>
    );
};

export default CheckoutScreen;
