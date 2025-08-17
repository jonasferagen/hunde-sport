import { PageBody, PageFooter, PageSection, PageView } from '@/components/layout';
import { ThemedText } from '@/components/ui';
import React from 'react';




export const CartScreen = () => {
    return (
        <PageView>
            <PageBody>
                <PageSection f={1} p="none">
                    <ThemedText >Handlekurv</ThemedText>

                </PageSection>
            </PageBody>
            <PageFooter f={0} >
                <ThemedText >Handlekurv</ThemedText>

            </PageFooter>
        </PageView>
    )
};
//    <CartList />   <CheckoutButton />