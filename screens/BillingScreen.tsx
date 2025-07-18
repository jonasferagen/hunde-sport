import { AddressForm } from '@/components/features/checkout/AddressForm';
import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Button } from '@/components/ui/button/Button';
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
            <PageHeader title={title}>
                <RouteTrail steps={checkoutFlow} currentStepName="billing" />
            </PageHeader>
            <PageSection flex>
                <PageContent flex>
                    <AddressForm onSubmit={handleBillingSubmit} />
                    <Button title="Gå til betaling" onPress={() => router.push(routes.payment())} />
                </PageContent>
            </PageSection>
        </PageView>
    );
};

export default BillingScreen;
