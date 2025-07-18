import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Button, CustomText } from '@/components/ui';
import { routes } from '@/config/routes';
import { router } from 'expo-router';
import React from 'react';

const BillingScreen = () => {
    const title = 'Fakturering';

    const handleNext = () => {
        router.push(routes.payment());
    };

    return (
        <PageView>
            <PageHeader title={title} />
            <PageSection flex>
                <PageContent>
                    <CustomText>Faktureringsinformasjon kommer her.</CustomText>
                    <Button title="Gå til Betaling" onPress={handleNext} />
                </PageContent>
            </PageSection>
        </PageView>
    );
};

export default BillingScreen;
