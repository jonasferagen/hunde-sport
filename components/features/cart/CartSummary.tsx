import { ThemedXStack, ThemedYStack } from '@/components/ui';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { ThemedText } from '@/components/ui/themed-components/ThemedText';
import { useCartContext } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/helpers';
import React, { JSX, memo } from 'react';

export const CartSummary = memo(
    (): JSX.Element => {

        const { cart, isUpdating } = useCartContext();

        return (
            <ThemedYStack container p="none">
                <ThemedXStack split>
                    {isUpdating && <ThemedSpinner />}
                    <ThemedText size="$6" o={isUpdating ? 0 : 1}>
                        {cart.items_count} var(er)
                    </ThemedText>
                    <ThemedText size="$6" bold o={isUpdating ? 0 : 1}>
                        {formatPrice(cart.totals.total_price)}
                    </ThemedText>
                </ThemedXStack>
            </ThemedYStack >

        );
    }
);
// <ThemedXStack box container split f={1}>