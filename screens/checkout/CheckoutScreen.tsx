import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { checkoutFlow } from '@/config/routes';
import { useOrderContext } from '@/contexts/OrderContext';
import { useRouter } from 'expo-router';
import React from 'react';

export const CheckoutScreen = () => {
    const router = useRouter();
    const { updateOrder, order } = useOrderContext();



    return (
        <PageView>

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


