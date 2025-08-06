import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { useCartContext, useProductContext } from '@/contexts';
import { ShoppingBasket } from '@tamagui/lucide-icons';
import React, { useRef } from 'react';
import { ButtonProps } from 'tamagui';



export const PurchaseButton = (props: ButtonProps) => {
    const { purchasable } = useProductContext();
    const { addItem, validatePurchasable } = useCartContext();
    const buttonRef = useRef(null);

    const handleAddToCart = () => {
        addItem(purchasable, { triggerRef: buttonRef });
    };

    const { isValid, message } = validatePurchasable(purchasable);

    return (
        <ThemedButton
            theme="secondary_alt2"
            f={1}
            onPress={handleAddToCart}
            ref={buttonRef}
            disabled={!isValid}
            jc="space-between"
            variant="accent"
            scaleIcon={1.5}
            icon={isValid ? <ShoppingBasket /> : null}
            fontWeight="bold"
            fontSize="$4"
            {...props}
        >
            <ThemedLinearGradient theme="secondary_alt1" br="$3" zIndex={-1} />
            {message}
        </ThemedButton >

    );
};
