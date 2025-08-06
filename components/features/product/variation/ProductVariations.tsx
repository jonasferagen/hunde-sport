import { useProductContext } from '@/contexts/ProductContext';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { ProductAttribute } from '@/types';
import React, { JSX, useCallback, useEffect, useState } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

export const ProductVariations = (): JSX.Element => {
    const { product } = useProductContext();
    if (!(product instanceof VariableProduct)) {
        return <></>;
    }

    return <ProductVariationsContent />;
};

const ProductVariationsContent = (): JSX.Element => {
    const { product: initialProduct, setSelectedVariation } = useProductContext();
    const product = initialProduct as VariableProduct;

    const [selectionManager, setSelectionManager] = useState(() => product.createSelectionManager());

    useEffect(() => {
        if (selectionManager) {
            const selectedVariation = selectionManager.getSelectedVariation();
            setSelectedVariation(selectedVariation);
        }
    }, [selectionManager, setSelectedVariation]);

    const handleSelectOption = useCallback(
        (attributeTaxonomy: string, optionSlug: string | null) => {
            if (selectionManager) {
                const newManager = selectionManager.select(attributeTaxonomy, optionSlug);
                setSelectionManager(newManager);
            }
        },
        [selectionManager]
    );

    if (!selectionManager) {
        return <></>;
    }

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