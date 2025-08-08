import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { useCartContext, useProductContext } from '@/contexts';
import { formatPrice } from '@/lib/helpers';
import { ValidationStatus } from '@/models/Product/Purchasable';
import { CircleX, PawPrint, TriangleAlert } from '@tamagui/lucide-icons';
import React, { JSX, useRef, } from 'react';
import { Button, ButtonProps, ThemeName } from 'tamagui';


interface ButtonStateConfig {
    icon: JSX.Element;
    theme: ThemeName;
}

// Map statuses to their corresponding configurations
const buttonConfig: Record<ValidationStatus, ButtonStateConfig> = {
    'OK': {
        icon: <PawPrint />,
        theme: 'success_alt7' as ThemeName
    },
    'ACTION_NEEDED': {
        icon: <TriangleAlert />,
        theme: 'success_alt7' as ThemeName,
    },
    'INVALID': {
        icon: <CircleX />,
        theme: 'success_alt1' as ThemeName,
    },
};

export const PurchaseButton = (props: ButtonProps) => {
    const { purchasable } = useProductContext();
    const { isValid, prices, message, status } = purchasable;

    const { addItem } = useCartContext();
    const buttonRef = useRef<React.ComponentRef<typeof Button>>(null);

    const handleAddToCart = () => {
        addItem(purchasable, { triggerRef: buttonRef });
    };
    // Get the configuration for the current status
    const { icon, theme } = buttonConfig[status as ValidationStatus];



    return (
        <CallToActionButton
            ref={buttonRef}
            theme={theme}
            onPress={handleAddToCart}
            disabled={!isValid}
            iconAfter={icon}
            {...props}
        >
            {isValid ? theme + ' ' + formatPrice(prices.price) : message}
        </CallToActionButton>
    );
};
