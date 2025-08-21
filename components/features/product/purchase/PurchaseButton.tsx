// PurchaseButton.tsx
import { CallToActionButton } from '@/components/ui/CallToActionButton';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { ThemedSurface } from '@/components/ui/themed-components/ThemedSurface';
import { THEME_CTA_BUY, THEME_CTA_VARIATION } from '@/config/app';
import { usePurchasableContext } from '@/contexts';
import { Boxes, ShoppingCart, X } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { Theme, type ThemeName } from 'tamagui';
import { ProductPrice } from '../display/ProductPrice';
import { computeCTA, type PurchaseCTAMode, type PurchaseCTAModeInput } from './purchase-cta';

const ICONS: Record<PurchaseCTAMode, JSX.Element> = {
    buy: <ShoppingCart />,
    'select-variation': <Boxes />,
    unavailable: <X />,
};

const THEMES: Record<PurchaseCTAMode, ThemeName> = {
    buy: THEME_CTA_BUY,
    'select-variation': THEME_CTA_VARIATION,
    unavailable: THEME_CTA_VARIATION, // or a danger theme if you prefer
};

type PurchaseButtonProps = {
    onPress: () => void;
    isLoading?: boolean;
    enabled?: boolean;
    /** Force the visual/logic mode. Default 'auto' derives from purchasable. */
    mode?: PurchaseCTAModeInput;
};

export const PurchaseButton = React.memo(function PurchaseButton({
    onPress,
    isLoading = false,
    enabled = true,
    mode = 'auto',
}: PurchaseButtonProps) {
    const { purchasable } = usePurchasableContext();

    // only recompute when something that affects the CTA changes
    const cta = React.useMemo(
        () => computeCTA(purchasable, mode),          // your 'auto' | forced mode helper
        [
            mode,
            purchasable.isVariable,
            purchasable.isValid,
            purchasable.message,
            purchasable.availability.isInStock,         // minimal keys that affect CTA
        ]
    );


    const theme = THEMES[cta.mode];
    const disabled = cta.disabled || isLoading || !enabled;

    const priceTag = (
        <Theme inverse>
            <ThemedSurface theme="shade" h="$6" ai="center" jc="center" px="none" mr={-20} minWidth={80} >
                {/* uses purchasable context in modal; on cards you can swap this to ProductPriceLite */}

                <ProductPrice />
            </ThemedSurface>
        </Theme>

    );

    return (
        // Replace icon/iconAfter with before/after
        <CallToActionButton
            onPress={onPress}
            disabled={disabled}
            before={ICONS[cta.mode]}
            theme={theme}
            label={isLoading ? undefined : cta.label}
            after={priceTag}
        >
            {isLoading && <ThemedSpinner />}
        </CallToActionButton>

    );
});
