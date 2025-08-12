
import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { THEME_VARIATION_BUTTON } from '@/config/app';
import { useProductModalContext } from '@/contexts';
import { usePurchasable } from '@/hooks/usePurchasable';
import { PawPrint } from '@tamagui/lucide-icons';
import React from 'react';


export const ProductVariationsButton = () => {
    const purchasable = usePurchasable();
    const { setPurchasable, toggleModal } = useProductModalContext();

    return (
        <>
            <CallToActionButton
                theme={THEME_VARIATION_BUTTON}
                iconAfter={<PawPrint />}
                onPress={() => {
                    setPurchasable(purchasable);
                    toggleModal();
                }}
            >
                Velg variant
            </CallToActionButton>

        </>
    );
};
