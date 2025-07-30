import { useProductContext } from '@/contexts/ProductContext';
import { useProductVariationSelectionContext } from '@/contexts/ProductVariationSelectionContext';
import React, { JSX } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

export const ProductVariations = (): JSX.Element => {
    const { product, isProductVariationsLoading } = useProductContext();
    if (!product.hasVariations() || isProductVariationsLoading) {
        return <></>;
    }

    return <ProductVariationsContent />;
};
const ProductVariationsContent = (): JSX.Element => {

    const { product } = useProductContext();

    const { productVariationAttributes, availableOptions } = useProductVariationSelectionContext();
    if (product.id === 247691) {
        console.log(productVariationAttributes)
        console.log(availableOptions)
    }

    return (
        <XStack gap="$2" flexWrap="wrap">
            {productVariationAttributes.map((attribute) => {
                const options = attribute.options.filter((o) => o.name);

                return (
                    <YStack key={attribute.id} flex={1} mb="$3">
                        {productVariationAttributes.length > 1 && (
                            <SizableText fontSize="$3" fontWeight="bold" textTransform="capitalize" mb="$2" ml="$1">
                                {attribute.name}
                            </SizableText>
                        )}
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
