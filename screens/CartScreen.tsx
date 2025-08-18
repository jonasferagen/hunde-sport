import { CartList } from '@/components/features/cart/CartList';
import { CheckoutButton } from '@/components/features/cart/CheckoutButton';
import { PageBody, PageFooter, PageSection, PageView } from '@/components/layout';
import React from 'react';

export const CartScreen = () => {

    return (
        <PageView>
            <PageBody>
                <PageSection f={1} p="none">
                    <CartList />
                </PageSection>
            </PageBody>
            <PageFooter>
                <CheckoutButton />
            </PageFooter>
        </PageView>
    );
};
