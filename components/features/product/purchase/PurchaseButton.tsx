// PurchaseButton.tsx
import { CallToActionButton } from '@/components/ui/CallToActionButton';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { ThemedSurface } from '@/components/ui/themed-components/ThemedSurface';
import { THEME_CTA_BUY, THEME_CTA_VARIATION } from '@/config/app';
import { usePurchasableContext } from '@/contexts';
import { Product, Purchasable } from '@/types';
import { Boxes, ShoppingCart, XCircle } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { Theme, type ThemeName } from 'tamagui';
import { ProductPrice } from '../display';


type PurchaseCTAMode = 'buy' | 'select-variation' | 'unavailable';
type PurchaseCTAModeInput = 'auto' | PurchaseCTAMode;

type PurchaseButtonProps = {
    onPress: () => void;
    isLoading?: boolean;
    enabled?: boolean;
    /** Force the visual/logic mode. Default 'auto' derives from purchasable. */
    mode?: PurchaseCTAModeInput;
};

const ICONS: Record<PurchaseCTAMode, JSX.Element> = {
    buy: <ShoppingCart />,
    'select-variation': <Boxes />,
    unavailable: <XCircle />,
};

const THEMES: Record<PurchaseCTAMode, ThemeName> = {
    buy: THEME_CTA_BUY,
    'select-variation': THEME_CTA_VARIATION,
    unavailable: THEME_CTA_VARIATION, // or a danger theme if you prefer
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
        [purchasable, mode]
    );

    const theme = THEMES[cta.mode];
    const disabled = cta.disabled || isLoading || !enabled;

    const priceTag = (
        <Theme inverse>
            <ThemedSurface theme="shade" h="$6" ai="center" jc="center" px="none" mr={-20} minWidth={80} >
                {/* uses purchasable context in modal; on cards you can swap this to ProductPriceLite */}
                <ProductPrice product={purchasable.activeProduct as Product} />
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



export type PurchaseCTAState = {
    mode: PurchaseCTAMode;
    label: string;
    disabled: boolean;
};

function computeCTA(p: Purchasable, mode: PurchaseCTAModeInput = 'auto'): PurchaseCTAState {
    if (mode !== 'auto') {
        // caller forces what the button looks like/does
        switch (mode) {
            case 'select-variation': return { mode, label: p.message, disabled: false };
            case 'unavailable': return { mode, label: p.message, disabled: true };
            case 'buy': return { mode, label: p.message, disabled: false };
        }
    }

    // auto: derive from purchasable
    if (!p.availability.isInStock) {
        return { mode: 'unavailable', label: p.message, disabled: true };
    }
    if (p.isVariable && !p.isValid) {
        return { mode: 'select-variation', label: p.message, disabled: false };
    }
    return { mode: 'buy', label: p.message, disabled: false };
}
