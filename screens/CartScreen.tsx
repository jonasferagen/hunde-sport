import { CartList } from '@/components/features/cart/CartList';
import { CheckoutButton } from '@/components/features/cart/CheckoutButton';
import { PageBody, PageSection, PageView } from '@/components/layout';
import { PageFooter } from '@/components/layout/PageFooter';
import { Defer } from '@/components/ui/Defer';
import React from 'react';

export const CartScreen = () => {
    return (
        <PageView>
            <PageBody mode="scroll">
                <PageSection f={1} p="none">
                    <Defer minDelay={60} once>
                        <CartList />
                    </Defer>
                </PageSection>
            </PageBody>
            <PageFooter f={0} >

                <CheckoutButton />

            </PageFooter>
        </PageView>
    )
};


//         