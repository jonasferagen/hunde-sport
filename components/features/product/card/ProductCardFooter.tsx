// ProductCTA.tsx
import { ThemedButton, ThemedLinearGradient, ThemedText } from '@/components/ui';
import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { useModalContext } from '@/contexts';
import { usePurchasable } from '@/hooks/usePurchasable';
import { VariableProduct } from '@/types';
import { Boxes, ShoppingCart, X } from '@tamagui/lucide-icons';
import * as Haptics from "expo-haptics";
import React from 'react';
import { YStack } from 'tamagui';
import { BaseProductPrice } from '../display/ProductPrice';

const icons = {
    VARIATION_REQUIRED: <Boxes />,
    OUT_OF_STOCK: <X />,
    INVALID_PRODUCT: <X />,
    OK: <ShoppingCart />
}

import { PRODUCT_CARD_NARROW_COLUMN_WIDTH } from './ProductCard';

export const ProductCardFooter = () => {

    const purchasable = usePurchasable();
    const { product, status, message, isValid } = purchasable;
    const { setPurchasable, toggleModal, setModalType } = useModalContext();
    const buttonRef = React.useRef<React.ComponentRef<typeof CallToActionButton>>(null);
    const isVariable = product instanceof VariableProduct;
    const disabled = !isValid && !isVariable;
    const icon = icons[status];

    const theme = !isValid ? 'tertiary' : isVariable ? "secondary" : "primary";



    const onPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setPurchasable(purchasable);
        setModalType(isVariable ? "variations" : "quantity");
        toggleModal();
    };

    return (
        <>
            <ThemedButton
                theme={theme}
                f={1}
                ref={buttonRef}

                onPress={onPress}
                disabled={disabled}
                aria-label={message}
                p="$2"
                bw={2}
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.25}
                shadowRadius={3.84}
                animation="fast"
                ov="hidden"
            >
                <ThemedButton.Icon>
                    {icon}
                </ThemedButton.Icon>
                <ThemedButton.Text fg={1}>
                    <ThemedText fos="$4">
                        {message}
                    </ThemedText>
                </ThemedButton.Text>
                <YStack theme="soft" h="$6" ai="center" jc="center" mr={-10} minWidth={PRODUCT_CARD_NARROW_COLUMN_WIDTH}>
                    <ThemedLinearGradient o={0.6} />
                    <BaseProductPrice />
                </YStack>
            </ThemedButton>

        </>
    );
};

const PriceBadge = () => {

    return (
        <YStack
            zIndex={20}
            pos="absolute"
            f={1}
            w="auto"
            px="$3"
            py="$3"
            br="$3"
            bg="$backgroundFocus"
            ai="center"
            jc="center"
            minWidth={PRODUCT_CARD_NARROW_COLUMN_WIDTH}
        >

        </YStack>
    );
};
