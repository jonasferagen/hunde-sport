import { ThemedXStack, ThemedYStack } from '@/components/ui';
import { usePurchasableContext } from '@/contexts';
import React from 'react';
import { Theme, YStack } from 'tamagui';
import { ProductImage } from '../display/ProductImage';
import { ProductStatus } from '../display/ProductStatus';
import { ProductTitle } from '../display/ProductTitle';
import { ProductVariations } from '../product-variation/ProductVariations';
import { ContinueButton } from './ContinueButton';


export const ProductVariationsModal = ({ onSelect }: { onSelect: () => void }) => {
    return ProductVariationsModalContent({ onSelect });
};


export const ProductVariationsModalContent = ({ onSelect }: { onSelect: () => void }) => {

    const { purchasable } = usePurchasableContext();

    return (
        <Theme name="soft">
            <YStack f={1} h="100%" gap="$3">
                <ProductImage img_height={150} />
                <ProductVariations />
                <ThemedYStack f={1}>
                    <ThemedXStack ai="center" jc="space-between">
                        <ProductTitle />
                        <ProductStatus />
                    </ThemedXStack>
                    <ContinueButton disabled={!purchasable.isValid} onPress={onSelect} />
                </ThemedYStack>
            </YStack>
        </Theme>
    );
}

