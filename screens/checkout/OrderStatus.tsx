import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';

import { checkoutFlow, routes } from '@/config/routes';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Button, SizableText } from 'tamagui';

export const OrderStatusScreen = () => {
    const router = useRouter();
    const title = 'Ordrestatus';

    const handleNext = () => {
        router.replace(routes.home());
    };

    return (
        <PageView>
            <Stack.Screen options={{ title }} />
            <PageHeader>
                <RouteTrail steps={checkoutFlow} currentStepName="order-status" />
            </PageHeader>
            <PageSection flex={1}>
                <PageContent flex={1}>
                    <SizableText>Takk for din bestilling!</SizableText>
                </PageContent>
                <PageContent>
                    <Button onPress={handleNext}>Tilbake til forsiden</Button>
                </PageContent>
            </PageSection>
        </PageView>
    );
};


