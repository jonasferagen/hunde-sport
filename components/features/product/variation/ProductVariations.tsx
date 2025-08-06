import { useProductContext } from '@/contexts/ProductContext';
import { useProductVariationContext } from '@/contexts/ProductVariationContext';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { VariationSelection } from '@/models/Product/VariationSelection';
import { ProductAttribute } from '@/types';
import React, { JSX, useEffect, useState } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

export const ProductVariations = (): JSX.Element => {
    const { product: originalProduct, setProductVariation } = useProductContext();
    const { isLoading } = useProductVariationContext();

    const product = originalProduct as VariableProduct;

    const [selectionManager, setSelectionManager] = useState<VariationSelection | null>(null);

    useEffect(() => {

        if (product instanceof VariableProduct && product.getVariationsData().length > 0) {
            setSelectionManager(product.createSelectionManager());
        }
    }, [product]);

    useEffect(() => {

        if (selectionManager) {
            const selectedVariation = selectionManager.getSelectedVariation();
            setProductVariation(selectedVariation);
        }
    }, [selectionManager, setProductVariation]);

    if (!(product instanceof VariableProduct) || !selectionManager || isLoading) {
        return <></>;
    }

    const handleSelectOption = (attributeTaxonomy: string, optionSlug: string | null) => {
        const newManager = selectionManager.select(attributeTaxonomy, optionSlug);
        setSelectionManager(newManager);
    };

    const attributes = product.getAttributesForVariationSelection();
    return (
        <XStack gap="$2" flexWrap="wrap" mt="$2">
            {attributes.map((attribute: ProductAttribute) => {
                const options = selectionManager.getAvailableOptions(attribute.taxonomy);
                const selectedValue = selectionManager.selections[attribute.taxonomy];

                return (
                    <YStack key={attribute.id} flex={1}>
                        <SizableText fos="$3" fow="bold" mb="$2" ml="$1" tt="capitalize">
                            {attribute.name}
                        </SizableText>
                        <AttributeSelector
                            options={options}
                            selectedValue={selectedValue}
                            onSelect={(value) => handleSelectOption(attribute.taxonomy, value)}
                        />
                    </YStack>
                );
            })}
        </XStack>
    );
};