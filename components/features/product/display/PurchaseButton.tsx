import { ThemedSpinner } from '@/components/ui';
import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { THEME_PURCHASE_BUTTON } from '@/config/app';
import { useCartContext } from '@/contexts';
import { usePurchasable } from '@/hooks/usePurchasable';
import { formatPrice } from '@/lib/helpers';
import { ShoppingCart } from '@tamagui/lucide-icons';
import React, { useRef } from 'react';
import { Button, ButtonProps } from 'tamagui';

interface PurchaseButtonProps extends ButtonProps {
    onPurchase?: () => void;
}

export const PurchaseButton = ({ onPurchase, ...props }: PurchaseButtonProps) => {
    const purchasable = usePurchasable();
    const { isValid, prices, message, status } = purchasable;

    const [isLoading, setIsLoading] = React.useState(false);

    const { addItem } = useCartContext();
    const buttonRef = useRef<React.ComponentRef<typeof Button>>(null);

    const handleAddToCart = async () => {
        setIsLoading(true);
        await addItem(purchasable, { triggerRef: buttonRef, silent: false });
        setIsLoading(false);
        onPurchase?.();
    };

    if (!isValid) {
        return null;
    }

    const price = formatPrice(prices.price);

    return (
        <CallToActionButton
            ref={buttonRef}
            theme={THEME_PURCHASE_BUTTON}
            onPress={handleAddToCart}
            disabled={!isValid || isLoading}
            iconAfter={isLoading ? <ThemedSpinner /> : <ShoppingCart />}
            textAfter={price}
            {...props}
        >
            Kjøp
        </CallToActionButton>
    );
};
