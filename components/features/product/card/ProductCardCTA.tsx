// ProductCTA.tsx
import { ThemedButton, ThemedText } from '@/components/ui';
import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { useModalContext } from '@/contexts';
import { usePurchasable } from '@/hooks/usePurchasable';
import { VariableProduct } from '@/types';
import { CircleAlert, ShoppingCart, X } from '@tamagui/lucide-icons';
import React from 'react';
import { BaseProductPrice } from '../display/ProductPrice';



const icons = {
    VARIATION_REQUIRED: <CircleAlert />,
    OUT_OF_STOCK: <X />,
    INVALID_PRODUCT: <X />,
    OK: <ShoppingCart />
}

export const ProductCardCTA = () => {

    const purchasable = usePurchasable();
    const { product, status, message, isValid } = purchasable;
    const { setPurchasable, toggleModal, modalType, setModalType } = useModalContext();
    const buttonRef = React.useRef<React.ComponentRef<typeof CallToActionButton>>(null);
    const isVariable = product instanceof VariableProduct;
    const disabled = !isValid && !isVariable;
    const icon = icons[status];

    const onPress = () => {
        setPurchasable(purchasable);
        setModalType(isVariable ? "variations" : "quantity");
        toggleModal();
    };

    return (
        <>
            <ThemedButton
                f={1}
                ref={buttonRef}
                theme="vstrong"
                onPress={onPress}
                disabled={disabled}
                p="$2"
                bw={2}
            >
                <ThemedButton.Icon>
                    {icon}
                </ThemedButton.Icon>
                <ThemedButton.Text fg={1}>
                    <ThemedText fos="$4">
                        {message}
                    </ThemedText>
                </ThemedButton.Text>
                <BaseProductPrice fos="$4" />
            </ThemedButton>

        </>
    );
};



