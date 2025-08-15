// /home/jonas/Prosjekter/hunde-sport/components/features/product/display/PurchaseButton.tsx
import { CallToActionButton } from '@/components/ui/CallToActionButton';
import { usePurchasableContext } from '@/contexts';
import { VariableProduct } from '@/types';
import { Boxes, ShoppingCart, X } from '@tamagui/lucide-icons';

import React from 'react';

import { ThemedYStack } from '@/components/ui';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { THEME_CTA_BUY, THEME_CTA_VARIATION } from '@/config/app';
import { BaseProductPrice } from '../display/ProductPrice';

const icons = {
    VARIATION_REQUIRED: <Boxes />,
    OUT_OF_STOCK: <X />,
    INVALID_PRODUCT: <X />,
    OK: <ShoppingCart />,
};

export const PurchaseButton = ({ onPress, isLoading = false }: { onPress: () => void, isLoading: boolean }) => {
    const { purchasable } = usePurchasableContext();
    const { product, status, message, isValid, availability } = purchasable;
    const isVariable = product instanceof VariableProduct;

    const disabled = (!isValid && !isVariable) || !availability.isInStock || isLoading;
    const icon = icons[status];
    const theme = isVariable ? THEME_CTA_VARIATION : THEME_CTA_BUY;

    const label = isLoading ? undefined : message;

    return (
        <CallToActionButton
            onPress={onPress}
            disabled={disabled}
            icon={icon}
            theme={theme}
            label={label}
            iconAfter={
                <ThemedYStack
                    box
                    theme="secondary"
                    h="$6"
                    ai="center"
                    jc="center"
                    px="$3"

                    boc="$borderColor"
                    mr={-20}
                    minWidth={80}
                >

                    <BaseProductPrice />
                </ThemedYStack>
            }

        > {isLoading && <ThemedSpinner />}
        </CallToActionButton>
    );
}; 