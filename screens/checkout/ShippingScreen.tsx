import { AddressForm, AddressFormData, AddressFormRef } from '@/components/features/checkout/AddressForm';
import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { checkoutFlow, routes } from '@/config/routes';
import { useOrderContext } from '@/contexts/OrderContext';
import { Address, BillingAddress } from '@/models/Order';
import { ArrowBigRight, CreditCard } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { XStack } from 'tamagui';

export const ShippingScreen = () => {
    const router = useRouter();
    const { updateOrder, order } = useOrderContext();
    const formRef = useRef<AddressFormRef>(null);

    const handleShippingSubmit = (data: AddressFormData) => {
        const fullBillingAddress: BillingAddress = {
            ...data,
            address_2: data.address_2 || '',
            country: 'NO',
            state: '',
        };

        const shippingAddress: Address = {
            ...fullBillingAddress,
        };

        updateOrder({ billing: fullBillingAddress, shipping: shippingAddress });
        router.push(routes.payment.path());
    };

    const handlePress = () => {
        formRef.current?.submit();
    };



    return (
        <PageView>
            <PageHeader padding="none">
                <RouteTrail steps={checkoutFlow} currentStepName="shipping" />
            </PageHeader>
            <PageSection flex={1} >
                <PageContent flex={1} padding='none' >
                    <AddressForm ref={formRef} onSubmit={handleShippingSubmit} initialData={order.billing} name="shipping" />
                </PageContent>
            </PageSection>
            <PageContent theme="secondary_soft">
                <XStack gap="$3" mt="$3" ai="center" jc="space-between">
                    <ThemedButton
                        onPress={handlePress}
                        scaleIcon={1.5}
                        flex={1}
                        jc="space-between"
                        theme="primary"
                    >
                        {'Til betaling'}
                        <XStack ai="center">
                            <CreditCard size="$4" />
                            <ArrowBigRight size="$3" />
                        </XStack>
                    </ThemedButton>
                </XStack>
            </PageContent>
        </PageView>
    );
};
