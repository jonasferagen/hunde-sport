import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { useCartContext, useProductContext } from '@/contexts';
import { formatPrice } from '@/utils/helpers';
import { ArrowBigRightDash, ShoppingBasket } from '@tamagui/lucide-icons';
import React, { useRef } from 'react';
import { ButtonProps, SizableText, Theme, XStack } from 'tamagui';



export const PurchaseButton = (props: ButtonProps) => {
    const { purchasable: validatedPurchasable } = useProductContext();
    const { title, price, isValid, message } = validatedPurchasable;

    const { addItem } = useCartContext();
    const buttonRef = useRef(null);


    const handleAddToCart = () => {
        addItem(validatedPurchasable, { triggerRef: buttonRef });
    };


    return (
        <Theme name="dark_green_alt2">
            <ThemedButton

                f={1}
                onPress={handleAddToCart}
                ref={buttonRef}
                disabled={!isValid}
                ai="center"
                jc="space-between"
                variant="accent"
                fontWeight="bold"
                fontSize="$4"
                {...props}
            >
                <ThemedLinearGradient br="$3" zIndex={-1} />
                {isValid ?
                    <XStack ai="center" gap="$2">
                        <XStack f={1} jc="space-between">
                            <SizableText fos="$4">{title}</SizableText>
                            <SizableText fos="$4">{formatPrice(price)}</SizableText>
                        </XStack>
                        <XStack ai="center">
                            <ArrowBigRightDash />
                            <ShoppingBasket />
                        </XStack>
                    </XStack>
                    : message}
            </ThemedButton >
        </Theme>

    );
};
