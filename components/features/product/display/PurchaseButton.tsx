import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { useCartContext, useProductContext } from '@/contexts';
import { ArrowBigUpDash, ShoppingBasket } from '@tamagui/lucide-icons';
import React, { useRef } from 'react';
import { ButtonProps } from 'tamagui';




export const PurchaseButton = (props: ButtonProps) => {
    const { product, purchasable } = useProductContext();

    if (!product) {
        return null;
    }

    const { addItem } = useCartContext();
    const buttonRef = useRef(null);

    const handleAddToCart = () => {
        addItem(purchasable, { triggerRef: buttonRef });
    };

    const { canPurchase, reason } = product.canPurchase();

    const buttonText = canPurchase ? "Legg til i handlekurv" : reason;

    const icon = canPurchase ? <ShoppingBasket /> : <ArrowBigUpDash />;
    const disabled = !canPurchase;

    return (
        <ThemedButton
            theme="secondary_alt2"
            f={1}
            onPress={handleAddToCart}
            ref={buttonRef}
            disabled={disabled}
            jc="space-between"
            variant="accent"
            scaleIcon={1.5}
            icon={icon}
            fontWeight="bold"
            fontSize="$4"
            {...props}
        >
            <ThemedLinearGradient theme="secondary_alt1" br="$3" zIndex={-1} />
            {buttonText}
        </ThemedButton >

    );
};
