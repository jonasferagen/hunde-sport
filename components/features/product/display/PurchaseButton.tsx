import { ThemedButton } from '@/components/ui/ThemedButton';
import { useProductContext, useShoppingCartContext } from '@/contexts';
import { Purchasable } from '@/types';
import { ArrowBigRightDash } from '@tamagui/lucide-icons';
import React, { useRef } from 'react';
import { ButtonProps, YStack } from 'tamagui';


export const PurchaseButtonTheme = "secondary_alt3";
export const PurchaseButton = (props: ButtonProps) => {
    const { product, productVariation } = useProductContext();
    const { addCartItem } = useShoppingCartContext();
    const buttonRef = useRef(null);

    const activeProduct = productVariation || product;

    const purchasable: Purchasable = {
        product,
        productVariation,
    };

    const handleAddToCart = () => {
        addCartItem(purchasable, { triggerRef: buttonRef });
    };

    const buttonText = !activeProduct.is_in_stock ? 'Velg en variant' : 'Legg til i handlekurv';
    const disabled = !activeProduct.is_in_stock;

    return <YStack theme={PurchaseButtonTheme} f={1}><ThemedButton
        onPress={handleAddToCart}
        ref={buttonRef}
        disabled={disabled}
        jc="space-between"
        variant="accent"
        scaleIcon={1.5}
        iconAfter={<ArrowBigRightDash />}
        fontWeight="bold"
        fontSize="$4"
        {...props}
    >
        {buttonText}
    </ThemedButton ></YStack>

};
