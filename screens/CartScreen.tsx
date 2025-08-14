import { CartSummary } from '@/components/features/cart';
import { CartList } from '@/components/features/cart/CartList';
import { CheckoutButton } from '@/components/features/cart/CheckoutButton';
import { PageBody, PageHeader, PageView } from '@/components/layout';
import { PageFooter } from '@/components/layout/PageFooter';
import { routes } from '@/config/routes';
import { HrefObject, Link } from 'expo-router';
import React from 'react';

export const CartScreen = () => {
    const href: HrefObject = routes.checkout.path();
    return (
        <PageView>
            <PageHeader >
                <CartSummary />
            </PageHeader>
            <PageBody>
                <CartList />
            </PageBody>
            <PageFooter f={0} >
                <Link href={href} asChild>
                    <CheckoutButton />
                </Link>
            </PageFooter>
        </PageView>

    )
};


