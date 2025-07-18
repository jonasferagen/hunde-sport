import { AddressForm } from '@/components/features/checkout/AddressForm';
import { PageHeader, PageView } from '@/components/layout';
import { Stack } from 'expo-router';
import React, { JSX } from 'react';

const BillingScreen = (): JSX.Element => {
    const handleBillingSubmit = (data: any) => {
        console.log('Billing data:', data);
        // Navigate to the next step (Payment)
    };

    const title = 'Fakturering';

    return (
        <PageView>
            <Stack.Screen options={{ title }} />
            <PageHeader title={title} />
            <AddressForm onSubmit={handleBillingSubmit} />
        </PageView>
    );
};

export default BillingScreen;
