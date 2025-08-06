import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { useCartContext, useProductContext } from '@/contexts';
import { Purchasable } from '@/types';
import { ArrowBigLeftDash, ShoppingBasket } from '@tamagui/lucide-icons';
import React, { useRef } from 'react';
import { ButtonProps, YStack } from 'tamagui';

const cannotPurchaseReason = (purchasable: Purchasable): string | undefined => {
    const activeProduct = purchasable.productVariation || purchasable.product;
    if (activeProduct.is_in_stock === false) {
        return "Ikke på lager";
    }
    if (!activeProduct.prices.price || activeProduct.prices.price === "") {
        return "Pris ikke tilgjengelig";
    }
    if (purchasable.product.type === "variable" && !purchasable.productVariation) {
        return "Velg en variant først";
    }

    if (activeProduct.is_purchasable === false) {
        return "Ikke tilgjengelig for kjøp";
    }

    return undefined
}




export const PurchaseButton = (props: ButtonProps) => {
    const { purchasableProduct } = useProductContext();

    if (!purchasableProduct) {
        return null;
    }

    const { addItem } = useCartContext();
    const buttonRef = useRef(null);

    const handleAddToCart = () => {
        addItem(purchasableProduct, { triggerRef: buttonRef });
    };

    const canPurchase = cannotPurchaseReason(purchasableProduct) === undefined;
    const buttonText = canPurchase ? "Legg til i handlekurv" : cannotPurchaseReason(purchasableProduct);
    const disabled = !canPurchase;

    const icon = canPurchase ? null : <ArrowBigLeftDash />;
    const iconAfter = canPurchase ? <ShoppingBasket /> : null;


    return (
        <YStack theme={'secondary_alt2'} f={1}>
            <ThemedButton
                onPress={handleAddToCart}
                ref={buttonRef}
                disabled={disabled}
                jc="space-between"
                variant="accent"
                scaleIcon={1.5}
                icon={icon}
                iconAfter={iconAfter}
                fontWeight="bold"
                fontSize="$4"
                {...props}
            >
                <ThemedLinearGradient theme="secondary_alt1" br="$3" />
                {buttonText}

            </ThemedButton >
        </YStack>
    );
};
