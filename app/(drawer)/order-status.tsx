import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Button, CustomText } from '@/components/ui';
import { routes } from '@/config/routes';
import { router } from 'expo-router';
import React from 'react';

const OrderStatusScreen = () => {
    const title = 'Ordrestatus';

    const handleNext = () => {
        router.replace(routes.home());
    };

    return (
        <PageView>
            <PageHeader title={title} />
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
