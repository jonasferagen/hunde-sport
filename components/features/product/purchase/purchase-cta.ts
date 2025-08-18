// purchase-cta.ts
import type { Purchasable } from '@/domain/Product/Purchasable';

export type PurchaseCTAMode = 'buy' | 'select-variation' | 'unavailable';
export type PurchaseCTAModeInput = 'auto' | PurchaseCTAMode;

export type PurchaseCTAState = {
    mode: PurchaseCTAMode;
    label: string;
    disabled: boolean;
};

export function computeCTA(p: Purchasable, mode: PurchaseCTAModeInput = 'auto'): PurchaseCTAState {
    if (mode !== 'auto') {
        // caller forces what the button looks like/does
        switch (mode) {
            case 'unavailable': return { mode, label: p.message, disabled: true };
            case 'select-variation': return { mode, label: p.message, disabled: false };
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
