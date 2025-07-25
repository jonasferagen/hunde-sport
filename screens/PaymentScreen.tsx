import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { checkoutFlow, routes } from '@/config/routes';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Button, SizableText } from 'tamagui';

const PaymentScreen = () => {
    const router = useRouter();
    const title = 'Betaling';

    const handleNext = () => {
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
