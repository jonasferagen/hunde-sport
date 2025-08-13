import { CartSummary } from '@/components/features/cart';
import { CartList } from '@/components/features/cart/CartList';
import { CheckoutButton } from '@/components/features/cart/CheckoutButton';
import { PageContent, PageHeader, PageView } from '@/components/layout';
import { PageFooter } from '@/components/layout/PageFooter';
import { routes } from '@/config/routes';
import { HrefObject, Link } from 'expo-router';
import React from 'react';

export const CartScreen = () => {
    const href: HrefObject = routes.checkout.path();
    return (
        <PageView>
            <PageHeader theme="soft">
                <CartSummary />
            </PageHeader>
            <PageContent f={1} p="none">
                <CartList />
            </PageContent>
            <PageFooter theme="soft" f={0} >
                <Link href={href} asChild>
                    <CheckoutButton />
                </Link>
            </PageFooter>
        </PageView>

    )
};


