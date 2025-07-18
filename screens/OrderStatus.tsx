import { PageHeader, PageView } from '@/components/layout';
import { Stack } from 'expo-router';
import React, { JSX } from 'react';

export const BillingScreen = (): JSX.Element => {

    const title = 'Ordrestatus';

    return (
        <PageView>
            <Stack.Screen options={{ title }} />
            <PageHeader title={title} />

        </PageView>
    );
};

