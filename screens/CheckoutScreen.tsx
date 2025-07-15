import { PageView } from '@/components/layout';
import { CustomText } from '@/components/ui';
import { Stack } from 'expo-router';
import React, { JSX } from 'react';

export const CheckoutScreen = (): JSX.Element => {
    return (
        <PageView>
            <Stack.Screen options={{ title: 'Kasse' }} />
            <CustomText>Checkout Screen</CustomText>
        </PageView>
    );
};
