import { AddressForm } from '@/components/features/checkout/AddressForm';
import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { checkoutFlow, routes } from '@/config/routes';
import { Stack, useRouter } from 'expo-router';
import React, { JSX } from 'react';

const BillingScreen = (): JSX.Element => {
    const router = useRouter();
    const handleBillingSubmit = (data: any) => {
        console.log('Billing data:', data);
        router.push(routes.payment());
    };

    const title = 'Fakturering';

    return (
        <PageView>
            <Stack.Screen options={{ title }} />
            <PageHeader>
                <RouteTrail steps={checkoutFlow} currentStepName="billing" />
            </PageHeader>
            <PageSection flex >
                <PageContent flex paddingHorizontal='none' >
                    <AddressForm onSubmit={handleBillingSubmit} />
                </PageContent>
            </PageSection>
        </PageView>
    );
};

export default BillingScreen;
