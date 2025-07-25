import { useProductContext } from '@/contexts/ProductContext';
import { useProductVariationSelectionContext } from '@/contexts/ProductVariationSelectionContext';
import React from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

export const ProductVariations = () => {
    const { product, isProductVariationsLoading } = useProductContext();
    const { productVariationAttributes } = useProductVariationSelectionContext();

    if (product.type !== 'variable' || isProductVariationsLoading) {
        return null;
    }
    return (
        <XStack gap="$2" flexWrap="wrap">
            {productVariationAttributes.map((attribute) => {
                const options = attribute.options.filter((o) => o.name);

                return (
                    <YStack key={attribute.id} flex={1} mb="$3">
                        <SizableText fontSize="$3" fontWeight="bold" textTransform="capitalize" mb="$2" ml="$1">
                            {attribute.name}
                        </SizableText>
                        <AttributeSelector
                            attribute={attribute}
                            options={options}
                        />
                    </YStack>
                );
            })}
        </XStack>


    );
};

