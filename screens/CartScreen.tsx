import { CartSummary } from '@/components/features/cart';
import { CartList } from '@/components/features/cart/CartList';
import { CheckoutButton } from '@/components/features/cart/CheckoutButton';
import { PageContent, PageHeader, PageView } from '@/components/layout';
import { routes } from '@/config/routes';
import { Link } from 'expo-router';
import React from 'react';
import { Theme, YStack } from 'tamagui';

export const CartScreen = () => {

    return (
        <Theme name="secondary_soft">
            <PageView>
                <PageHeader >
                    <CartSummary />
                </PageHeader>
                <PageContent f={1}>
                    <YStack f={1}>
                        <CartList />
                    </YStack>
                </PageContent>
                <PageHeader>
                    <Link href={routes.checkout.path()} asChild>
                        <CheckoutButton />
                    </Link>
                </PageHeader>
            </PageView>
        </Theme>
    )
};
