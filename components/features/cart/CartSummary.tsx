import { ThemedSpinner } from '@/components/ui/ThemedSpinner';
import { ThemedText } from '@/components/ui/ThemedText';
import { useCartContext } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/helpers';
import React, { JSX, memo } from 'react';
import { SizableText, XStack } from 'tamagui';



export const CartSummary = memo(
    (): JSX.Element => {

        const { cart, isUpdating } = useCartContext();



        return <XStack jc="space-between" ai="center" gap="$3">
            {isUpdating ? <ThemedSpinner /> :
                <>
                    <XStack ai="center" gap="$3" jc="flex-end">
                        <SizableText size="$4" ta="right">
                            {cart.items_count} var(er)
                        </SizableText>
                        <SizableText size="$4" ta="right">

                        </SizableText>
                    </XStack>
                    <XStack gap="$3" ai="center">
                        <ThemedText fos="$3" fow='bold'>
                            {formatPrice(cart.totals.total_price)}
                        </ThemedText>
                    </XStack>
                </>}
        </XStack>
    }
);
