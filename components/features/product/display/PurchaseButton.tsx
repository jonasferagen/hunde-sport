import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedLinearGradient } from '@/components/ui/ThemedLinearGradient';
import { useCartContext, useProductContext } from '@/contexts';
import { ProductPrices } from '@/models/Product/ProductPrices';
import { formatPrice } from '@/utils/helpers';
import { CircleX, ShoppingCart, TriangleAlert } from '@tamagui/lucide-icons';
import React, { useRef } from 'react';
import { ButtonProps, SizableText, Theme, XStack } from 'tamagui';



export const PurchaseButton = (props: ButtonProps) => {
    const { purchasable } = useProductContext();
    const { title, prices, isValid, message, status } = purchasable;

    const { addItem } = useCartContext();
    const buttonRef = useRef(null);


    const handleAddToCart = () => {
        addItem(purchasable, { triggerRef: buttonRef });
    };

    const icon = status === 'INVALID' ? <CircleX /> : status === 'ACTION_NEEDED' ? <TriangleAlert /> : <ShoppingCart />;
    const theme = status === 'INVALID' ? "dark_red_alt2" : status === 'ACTION_NEEDED' ? "dark_yellow_alt2" : "dark_green_alt2";

    return (
        <Theme name={theme}>
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
                icon={icon}
                scaleIcon={1.5}
                {...props}
            >
                <ThemedLinearGradient br="$3" zIndex={-1} />
                {isValid ? <PurchaseButtonContent title={title} prices={prices} /> : message}
            </ThemedButton >
        </Theme>

    );
};

const PurchaseButtonContent = ({ title, prices }: { title: string; prices: ProductPrices }) => {
    return (
        <XStack f={1} fs={1} ai="center" gap="$2">
            <XStack f={1} jc="space-between">
                <SizableText fos="$4">{title}</SizableText>
                <SizableText fos="$4">{formatPrice(prices.price)}</SizableText>
            </XStack>
        </XStack>
    );
};