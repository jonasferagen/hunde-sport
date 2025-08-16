import { CartList } from '@/components/features/cart/CartList';
import { CheckoutButton } from '@/components/features/cart/CheckoutButton';
import { PageBody, PageSection, PageView } from '@/components/layout';
import { PageFooter } from '@/components/layout/PageFooter';
import React from 'react';

export const CartScreen = () => {

    return (
        <PageView>
            <PageBody>
                <PageSection f={1} p="none" boc="blue" bw={1}>
                    <CartList />
                </PageSection>
            </PageBody>
            <PageFooter f={0} >
                <CheckoutButton />
            </PageFooter>
        </PageView>

    )
};


