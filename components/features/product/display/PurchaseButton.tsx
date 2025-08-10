import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { THEME_PURCHASE_BUTTON, THEME_VARIATION_BUTTON } from '@/config/app';
import { useCartContext, useProductContext } from '@/contexts';
import { formatPrice } from '@/lib/helpers';
import { Plus, ShoppingCart } from '@tamagui/lucide-icons';
import React, { JSX, useRef, } from 'react';
import { Button, ButtonProps, ThemeName } from 'tamagui';

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
    const theme = status === "OK" ? THEME_PURCHASE_BUTTON : THEME_VARIATION_BUTTON
    const icon = status === "OK" ? <ShoppingCart /> : <Plus />;

    const price = isValid ? formatPrice(prices.price) : "";
    const label = isValid ? "Kjøp" : message;

    return (
        <CallToActionButton

            ref={buttonRef}
            theme={theme}
            onPress={handleAddToCart}
            disabled={!isValid}
            iconAfter={icon}
            textAfter={price}
            {...props}
        >
            {label}

        </CallToActionButton>
    );
};
