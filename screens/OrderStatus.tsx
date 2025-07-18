import { RouteTrail } from '@/components/features/checkout/RouteTrail';
import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Button, CustomText } from '@/components/ui';
import { checkoutFlow, routes } from '@/config/routes';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

const OrderStatusScreen = () => {
    const router = useRouter();
    const title = 'Ordrestatus';

    const handleNext = () => {
        router.replace(routes.home());
    };

    return (
        <PageView>
            <Stack.Screen options={{ title }} />
            <PageHeader title={title}>
                <RouteTrail steps={checkoutFlow} currentStepName="order-status" />
            </PageHeader>
            <PageSection flex>
                <PageContent>
                    <CustomText>Takk for din bestilling!</CustomText>
                    <Button title="Tilbake til forsiden" onPress={handleNext} />
                </PageContent>
            </PageSection>
        </PageView>
    );
};

export default OrderStatusScreen;
