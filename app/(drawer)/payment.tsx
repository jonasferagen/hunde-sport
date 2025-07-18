import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Button, CustomText } from '@/components/ui';
import { routes } from '@/config/routes';
import { router } from 'expo-router';
import React from 'react';

const PaymentScreen = () => {
    const title = 'Betaling';

    const handleNext = () => {
        router.push(routes.orderStatus());
    };

    return (
        <PageView>
            <PageHeader title={title} />
            <PageSection flex>
                <PageContent>
                    <CustomText>Betalingsinformasjon kommer her.</CustomText>
                    <Button title="Fullfør Kjøp" onPress={handleNext} />
                </PageContent>
            </PageSection>
        </PageView>
    );
};

export default PaymentScreen;
