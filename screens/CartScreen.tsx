import { CartSummary } from '@/components/features/cart';
import { CartList } from '@/components/features/cart/CartList';
import { CheckoutButton } from '@/components/features/cart/CheckoutButton';
import { PageContent, PageHeader, PageView } from '@/components/layout';
import { PageFooter } from '@/components/layout/PageFooter';
import { routes } from '@/config/routes';
import { HrefObject, Link } from 'expo-router';
import React from 'react';
import { Theme, YStack } from 'tamagui';

export const CartScreen = () => {
    const href: HrefObject = routes.checkout.path();
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
                <PageFooter f={0}>
                    <YStack>
                        <Link href={href} asChild>
                            <CheckoutButton />
                        </Link>
                    </YStack>
                </PageFooter>
            </PageView>
        </Theme>
    )
};


