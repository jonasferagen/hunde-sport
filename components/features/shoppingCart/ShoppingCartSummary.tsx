import React, { JSX, memo } from 'react';
import { SizableText, XStack } from 'tamagui';

interface ShoppingCartSummaryProps {
    cartItemCount: number;
    cartTotal: number;
    onClearCart: () => void;
}

export const ShoppingCartSummary = memo(
    ({ cartItemCount, cartTotal, onClearCart }: ShoppingCartSummaryProps): JSX.Element => {

        return (
            <>
                <XStack jc="space-between" ai="center">
                    <SizableText fontWeight="bold" size="$6" textAlign="right">
                        Antall: {cartItemCount}
                    </SizableText>
                    <SizableText fontWeight="bold" size="$6" textAlign="right">
                        Total: {cartTotal}
                    </SizableText>
                </XStack>

            </>
        );
    }
);
