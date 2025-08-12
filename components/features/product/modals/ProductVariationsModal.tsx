import { ThemedLinearGradient } from '@/components/ui';
import { usePurchasableContext } from '@/contexts';
import React from 'react';

import { Purchasable } from '@/types';
import { ProductVariationSelect } from '../product-variation/ProductVariationSelect';
import { PurchaseWizardStep } from './PurchaseWizard';


export const ProductVariationsModal = ({
    onNext,
    onBack,
}: {
    onNext: (purchasable: Purchasable) => void,
    onBack: (purchasable: Purchasable) => void
}) => {

    const { purchasable } = usePurchasableContext();

    return (
        <PurchaseWizardStep
            onNext={onNext}
            onBack={onBack}
            purchasable={purchasable}
        >
            <>
                <ThemedLinearGradient />
                <ProductVariationSelect />
            </>
        </PurchaseWizardStep>

    );
}

