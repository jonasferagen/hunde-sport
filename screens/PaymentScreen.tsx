import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Button, CustomText } from '@/components/ui';
import { checkoutFlow, routes } from '@/config/routes';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

const PaymentScreen = () => {
    const router = useRouter();
    const title = 'Betaling';

    const handleNext = () => {
        router.push(routes.orderStatus());
    };

    return (
        <PageView>
            <Stack.Screen options={{ title }} />
            <PageHeader title={title}>
                <RouteTrail steps={checkoutFlow} currentStepName="payment" />
            </PageHeader>
            <PageSection flex>
                <PageContent flex>
                    <CustomText>Betalingsinformasjon kommer her.</CustomText>
                </PageContent>
                <PageContent>
                    <Button title="Fullfør Kjøp" onPress={handleNext} />
                </PageContent>
            </PageSection>
        </PageView>
    );
};

export default PaymentScreen;
