import { CartSummary } from '@/components/features/cart';
import { CartList } from '@/components/features/cart/CartList';
import { CheckoutButton } from '@/components/features/cart/CheckoutButton';
import { PageContent, PageHeader, PageView } from '@/components/layout';
import { useCartContext } from '@/contexts/CartContext';
import { useCartStore } from '@/stores/CartStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { Theme, YStack } from 'tamagui';

export const CartScreen = () => {
    const { cart, isUpdating } = useCartContext();
    const { cartToken } = useCartStore();
    const router = useRouter();


    const handleCheckout = () => {
        router.push('/checkout'); // Navigate to the new WebView screen
    };

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
                <PageContent>
                    <CheckoutButton />
                </PageContent>
            </PageView>
        </Theme >
    )
};
