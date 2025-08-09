import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { THEME_PURCHASE_BUTTON } from '@/config/app';
import { useCartContext, useProductContext } from '@/contexts';
import { formatPrice } from '@/lib/helpers';
import { ShoppingCart } from '@tamagui/lucide-icons';
import React, { JSX, useRef, } from 'react';
import { Button, ButtonProps, ThemeName, XStack } from 'tamagui';

interface ButtonStateConfig {
    icon: JSX.Element;
    theme: ThemeName;
}



export const PurchaseButton = (props: ButtonProps) => {
    const { purchasable } = useProductContext();
    const { isValid, prices, message, status } = purchasable;

    const { addItem } = useCartContext();
    const buttonRef = useRef<React.ComponentRef<typeof Button>>(null);

    const handleAddToCart = () => {
        addItem(purchasable, { triggerRef: buttonRef });
    };
    // Get the configuration for the current status
    const theme = THEME_PURCHASE_BUTTON;
    const icon = <ShoppingCart />;

    const price = isValid ? formatPrice(prices.price) : "";
    const label = isValid ? "Kjøp" : message;

    return (
        <CallToActionButton

            ref={buttonRef}
            theme={theme}
            onPress={handleAddToCart}
            disabled={!isValid}
            iconAfter={icon}
            {...props}
        >
            <XStack ai="center" gap="$2" jc="space-between" f={1}>
                <ThemedText fow="bold" fos="$4" f={1} textAlign='left'>{label}</ThemedText>
                <ThemedText fow="bold" fos="$4" f={0} textAlign='right'>{price}</ThemedText>
            </XStack>

        </CallToActionButton>
    );
};
