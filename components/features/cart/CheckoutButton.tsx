import { ThemedSpinner, ThemedText, ThemedXStack } from '@/components/ui';
import { CallToActionButton } from '@/components/ui/CallToActionButton';
import { THEME_CTA_CHECKOUT } from '@/config/app';
import { useCartContext } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/helpers';
import { ExternalLink } from '@tamagui/lucide-icons';
import React from 'react';
import { ButtonProps } from 'tamagui';

interface CheckoutButtonProps extends ButtonProps {

}



export const CheckoutButton = ({ disabled, ...props }: CheckoutButtonProps) => {
    const { cart, isUpdating } = useCartContext();

    const icon = null;
    const iconAfter = <ExternalLink />

    return (
        <CallToActionButton
            size="$5"
            disabled={disabled || isUpdating}
            f={0}
            icon={icon}
            iconAfter={iconAfter}
            {...props}
            theme={THEME_CTA_CHECKOUT}
        >
            {
                <ThemedXStack split p="none" w="100%" ai="center">
                    {isUpdating ? <ThemedSpinner /> : (
                        <>
                            <ThemedText size="$6" >{cart.items_count} var(er)</ThemedText>
                            <ThemedText size="$6" bold>   {formatPrice(String(Number(cart.totals.total_price) + Number(cart.totals.total_tax)))}</ThemedText>
                        </>
                    )}
                </ThemedXStack>
            }
        </CallToActionButton>
    );
};