// PurchaseButton.tsx
import { CallToActionButton } from '@/components/ui/CallToActionButton';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { ThemedSurface } from '@/components/ui/themed-components/ThemedSurface';
import { THEME_CTA_BUY, THEME_CTA_VARIATION } from '@/config/app';
import { usePurchasableContext } from '@/contexts';
import { Boxes, ShoppingCart, X } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import type { ThemeName } from 'tamagui';
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
        () => computeCTA(purchasable, mode),
        [mode, purchasable.isVariable, purchasable.isValid, purchasable.message,
            purchasable.availability.isInStock] // add your price/availability keys if you have them
    );

    const theme = THEMES[cta.mode];
    const disabled = cta.disabled || isLoading || !enabled;

    const priceTag = (
        <ThemedSurface theme="shade" h="$6" ai="center" jc="center" px="$3" mr={-20} minWidth={80}>
            {/* uses purchasable context in modal; on cards you can swap this to ProductPriceLite */}
            <ProductPrice />
        </ThemedSurface>
    );

    return (
        <CallToActionButton
            onPress={onPress}
            disabled={disabled}
            icon={ICONS[cta.mode]}
            theme={theme}
            label={isLoading ? undefined : cta.label}
            iconAfter={priceTag}
        >
            {isLoading && <ThemedSpinner />}
        </CallToActionButton>
    );
});
