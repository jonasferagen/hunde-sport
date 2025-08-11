// /home/jonas/Prosjekter/hunde-sport/components/features/product/display/PurchaseButton.tsx
import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { THEME_PURCHASE_BUTTON_ERROR, THEME_PURCHASE_BUTTON_OK, THEME_VARIATION_BUTTON_OK } from '@/config/app';
import { useModalContext, usePurchasableContext } from '@/contexts';
import { VariableProduct } from '@/types';
import { Boxes, ShoppingCart, X } from '@tamagui/lucide-icons';

import { ThemedLinearGradient } from '@/components/ui';
import React from 'react';
import { YStack } from 'tamagui';
import { PRODUCT_CARD_NARROW_COLUMN_WIDTH } from '../card';
import { BaseProductPrice } from './ProductPrice';

const icons = {
    VARIATION_REQUIRED: <Boxes />,
    OUT_OF_STOCK: <X />,
    INVALID_PRODUCT: <X />,
    OK: <ShoppingCart />,
};

export const PurchaseButton = () => {
    const { purchasable } = usePurchasableContext();

    const { product, status, message, isValid } = purchasable;
    const { setPurchasable: setModalPurchasable, toggleModal, setModalType } = useModalContext();
    const isVariable = product instanceof VariableProduct;

    const disabled = !isValid && !isVariable;
    const icon = icons[status];
    const theme = !isValid ?
        THEME_PURCHASE_BUTTON_ERROR : isVariable ?
            THEME_VARIATION_BUTTON_OK : THEME_PURCHASE_BUTTON_OK;

    const modalType = isVariable ? 'variations' : 'quantity';

    const onPress = () => {
        setModalPurchasable(purchasable);
        setModalType(modalType);
        toggleModal();
    };

    return (
        <CallToActionButton
            onPress={onPress}
            disabled={disabled}
            icon={icon}
            theme={theme}
            label={message}
            after={
                <YStack
                    theme="normal"
                    h="$6"
                    ai="center"
                    jc="center"
                    px="$3"
                    boc="$borderColor"
                    mr={-20}
                    minWidth={PRODUCT_CARD_NARROW_COLUMN_WIDTH}
                >
                    <ThemedLinearGradient br="$3" />
                    <BaseProductPrice />
                </YStack>
            } />);
};