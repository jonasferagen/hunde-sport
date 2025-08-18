import { CartList } from '@/components/features/cart/CartList';
import { CheckoutButton } from '@/components/features/cart/CheckoutButton';
import { PageBody, PageFooter, PageSection, PageView } from '@/components/layout';
import { useScreenReady } from '@/hooks/useScreenReady';
import React from 'react';

export const CartScreen = () => {
    const ready = useScreenReady(); // or useScreenReady(50) to push a frame
    return (
        <PageView>
            <PageBody>
                <PageSection f={1} p="none">
                    {ready && <CartList />}
                </PageSection>
            </PageBody>
            <PageFooter>
                {ready && <CheckoutButton />}
            </PageFooter>
        </PageView >
    );
};
