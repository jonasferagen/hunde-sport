import { useProductContext } from '@/contexts/ProductContext';
import { ProductVariationProvider, useProductVariationContext } from '@/contexts/ProductVariationContext';
import React from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

export const ProductVariations = () => {
    const { product, isProductVariationsLoading, productVariations, productVariation } = useProductContext();


    if (product.type !== 'variable' || isProductVariationsLoading) {
        return null;
    }

    return (

        <ProductVariationProvider product={product} productVariations={productVariations} initialProductVariation={productVariation}>

            <ProductVariationsContent />

        </ProductVariationProvider>
    );
};


const ProductVariationsContent = () => {
    const { productVariationAttributes } = useProductVariationContext();

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