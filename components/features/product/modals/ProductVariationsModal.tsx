import { ThemedLinearGradient, ThemedXStack, ThemedYStack } from '@/components/ui';
import { usePurchasableContext } from '@/contexts';
import React from 'react';
import { ScrollView } from 'tamagui';
import { ProductImage, ProductPrice, ProductStatus, ProductVariationLabel } from '../display';

import { Purchasable } from '@/types';
import { ProductVariationSelect } from '../product-variation/ProductVariationSelect';
import { BackButton } from './BackButton';
import { NextButton } from './NextButton';


export const ProductVariationsModal = ({
    onNext,
    onBack,
}: {
    onNext: (purchasable: Purchasable) => void,
    onBack: (purchasable: Purchasable) => void
}) => {

    const { purchasable } = usePurchasableContext();

    return (

        <ThemedYStack f={1} h="100%" >
            <ProductImage img_height={200} />

            <ScrollView h="100%" fs={1}>
                <ThemedLinearGradient />
                <ProductVariationSelect />
            </ScrollView>
            <ThemedYStack>
                <ProductVariationLabel />
                <ThemedXStack ai="center" jc="space-between">
                    <ProductStatus />
                    <ProductPrice />
                </ThemedXStack>
                <NextButton
                    disabled={!purchasable.isValid}
                    onPress={() => onNext(purchasable)}
                />
                <BackButton
                    onPress={() => onBack(purchasable)}
                    disabled={false}
                />
            </ThemedYStack>
        </ThemedYStack>

    );
}

