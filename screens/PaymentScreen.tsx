import { PageContent, PageHeader, PageSection, PageView } from '@/components/layout';
import { Button } from '@/components/ui/button/Button';
import { CustomText } from '@/components/ui/text/CustomText';
import { Stack, useRouter } from 'expo-router';
import React, { JSX } from 'react';

const PaymentScreen = (): JSX.Element => {
    const router = useRouter();
    const title = 'Betaling';

    return (
        <PageView>
            <Stack.Screen options={{ title }} />
            <PageHeader title={title} />
            <PageSection>
                <PageContent>
                    <CustomText>Betalingsalternativer kommer her.</CustomText>
                    <Button title="Fullfør bestilling" onPress={() => { }} />
                </PageContent>
            </PageSection>
        </PageView>
    );
};

export default PaymentScreen;
