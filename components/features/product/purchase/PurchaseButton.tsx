// PurchaseButton.tsx (view-only)
import { Boxes, ShoppingCart, XCircle } from '@tamagui/lucide-icons';
import React from 'react';
import { type JSX } from 'react';
import { type ThemeName } from 'tamagui';

import { CallToActionButton } from '@/components/ui/CallToActionButton';
import { THEME_CTA_BUY, THEME_CTA_VARIATION } from '@/config/app';

export type PurchaseCTAMode = 'buy' | 'select-variation' | 'unavailable';

const ICONS: Record<PurchaseCTAMode, JSX.Element> = {
    buy: <ShoppingCart />,
    'select-variation': <Boxes />,
    unavailable: <XCircle />,
};

const THEMES: Record<PurchaseCTAMode, ThemeName> = {
    buy: THEME_CTA_BUY,
    'select-variation': THEME_CTA_VARIATION,
    unavailable: THEME_CTA_VARIATION,
};

type PurchaseButtonBaseProps = {
    mode: PurchaseCTAMode;
    label: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    /** Optional right-side content (e.g., price tag) */
    after?: React.ReactNode;
};

export const PurchaseButtonBase = React.memo(function PurchaseButtonBase({
    mode,
    label,
    onPress,
    loading = false,
    disabled = false,
    after,
}: PurchaseButtonBaseProps) {
    return (
        <CallToActionButton
            onPress={onPress}
            disabled={disabled}
            before={ICONS[mode]}
            theme={THEMES[mode]}
            label={label}
            loading={loading}
            after={after}
        />
    );
});
