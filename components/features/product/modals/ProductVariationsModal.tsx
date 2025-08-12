import { ThemedXStack, ThemedYStack } from '@/components/ui';
import { usePurchasableContext } from '@/contexts';
import React from 'react';
import { Theme, YStack } from 'tamagui';
import { ProductImage, ProductPrice, ProductStatus, ProductTitle, ProductVariationLabel } from '../display';

import { Purchasable } from '@/models/Product/Purchasable';
import { ProductVariationSelect } from '../product-variation/ProductVariationSelect';
import { ContinueButton } from './ContinueButton';





export const ProductVariationsModal = ({ onSelect }: { onSelect: (purchasable: Purchasable) => void }) => {

    const { purchasable } = usePurchasableContext();

    return (
        <Theme name="soft">
            <YStack f={1} h="100%" gap="$3">
                <ProductImage img_height={200} />
                <ProductVariationSelect />
                <ThemedYStack f={1}>
                    <ProductTitle />
                    <ThemedXStack ai="center" jc="space-between">
                        <ThemedXStack jc="space-between" ai="center" gap="$3">
                            <ProductStatus />
                            <ProductVariationLabel />
                        </ThemedXStack>
                        <ProductPrice />
                    </ThemedXStack>
                    <ContinueButton
                        disabled={!purchasable.isValid}
                        onPress={() => onSelect(purchasable)}
                    />
                </ThemedYStack>
            </YStack>
        </Theme>
    );
}

