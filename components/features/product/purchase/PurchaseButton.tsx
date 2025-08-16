// /home/jonas/Prosjekter/hunde-sport/components/features/product/display/PurchaseButton.tsx
import { CallToActionButton } from '@/components/ui/CallToActionButton';
import { Boxes, ShoppingCart, X } from '@tamagui/lucide-icons';

import React, { JSX } from 'react';

import { ThemedYStack } from '@/components/ui';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { THEME_CTA_BUY, THEME_CTA_VARIATION } from '@/config/app';
import { ProductPrice } from '../display/ProductPrice';



type PurchaseButtonProps = {
    cta: PurchaseCTAState;
    onPress: () => void;
    isLoading?: boolean;
    // optional overrides
    themeOverride?: ThemeName;
};

const ICONS: Record<PurchaseCTAState['mode'], JSX.Element> = {
    buy: <ShoppingCart />,
    'select-variation': <Boxes />,
    unavailable: <X />,
};

const THEMES: Record<PurchaseCTAState['mode'], ThemeName> = {
    buy: THEME_CTA_BUY,
    'select-variation': THEME_CTA_VARIATION,
    unavailable: THEME_CTA_VARIATION, // or a danger theme
};

export const PurchaseButton = ({
    cta,
    onPress,
    isLoading = false,
    themeOverride,

}: PurchaseButtonProps) => {
    const theme = themeOverride ?? THEMES[cta.mode];
    const disabled = cta.disabled || isLoading;

    const priceTag = (
        <ThemedYStack box theme="shade" h="$6" ai="center" jc="center" px="$3" mr={-20} minWidth={80}>
            <ProductPrice />
        </ThemedYStack>
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
}

export type PurchaseCTAMode = 'buy' | 'select-variation' | 'unavailable';

export type PurchaseCTAState = {
    mode: PurchaseCTAMode;       // drives theme/icon
    label: string;               // button label
    disabled: boolean;           // final disabled state

};

// purchaseCta.ts
import { Purchasable } from '@/models/Product/Purchasable';
import { ThemeName } from 'tamagui';

export function derivePurchaseCTA(p: Purchasable): PurchaseCTAState {
    if (!p.availability.isInStock) {
        return { mode: 'unavailable', label: p.message, disabled: true };
    }
    if (p.isVariable && !p.isValid) {
        return { mode: 'select-variation', label: p.message, disabled: false };
    }
    // simple or valid variation
    return { mode: 'buy', label: p.message, disabled: false };
}
