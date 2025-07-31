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

    const { productVariationAttributes } = useProductVariationSelectionContext();

    return (
        <XStack gap="$2" flexWrap="wrap">
            {productVariationAttributes.map((attribute) => {
                return (
                    <YStack key={attribute.id} flex={1} mb="$3">
                        {productVariationAttributes.length > 1 && (
                            <SizableText fontSize="$3" fontWeight="bold" textTransform="capitalize" mb="$2" ml="$1">
                                {attribute.name}
                            </SizableText>
                        )}
                        <AttributeSelector
                            attribute={attribute}
                            options={attribute.options}
                        />
                    </YStack>
                );
            })}
        </XStack>
    );
};
