import { AddressForm } from '@/components/features/checkout/AddressForm';
import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { checkoutFlow, routes } from '@/config/routes';
import { useOrderContext } from '@/contexts';
import { Address, BillingAddress } from '@/models/Order';
import { Stack, useRouter } from 'expo-router';
import React, { JSX } from 'react';

const ShippingScreen = (): JSX.Element => {
    const router = useRouter();
    const { updateOrder } = useOrderContext();

    const handleShippingSubmit = (data: Omit<BillingAddress, 'address_2' | 'country'> & { address_2?: string }) => {
        const fullBillingAddress: BillingAddress = {
            ...data,
            address_2: data.address_2 || '',
            country: 'NO',
        };

        const shippingAddress: Address = {
            ...fullBillingAddress,
        };

        updateOrder({ billing: fullBillingAddress, shipping: shippingAddress });
        router.push(routes.payment());
    };

    const title = 'Levering';

    return (
        <PageView>
            <Stack.Screen options={{ title }} />
            <PageHeader>
                <RouteTrail steps={checkoutFlow} currentStepName="shipping" />
            </PageHeader>
            <PageSection flex={1}>
                <PageContent flex={1} paddingHorizontal='none' >
                    <AddressForm onSubmit={handleShippingSubmit} />
                </PageContent>
            </PageSection>
        </PageView>
    );
};

export default ShippingScreen;
