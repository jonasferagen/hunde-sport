import { useProductContext } from '@/contexts/ProductContext';
import { useProductVariations } from '@/hooks/data/Product';
import { ProductAttribute } from '@/models/Product/ProductAttribute';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { VariationSelection } from '@/models/Product/VariationSelection';
import React, { JSX, useEffect, useState } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

export const ProductVariations = (): JSX.Element => {
    const { product, setProductVariation } = useProductContext();

    if (!(product instanceof VariableProduct)) {
        return <></>;
    }

    const variableProduct = product as VariableProduct;
    const { isLoading: areVariationsLoading } = useProductVariations(variableProduct);

    const [selectionManager, setSelectionManager] = useState<VariationSelection | null>(null);

    useEffect(() => {
        variableProduct.setVariationsLoading(areVariationsLoading);
        if (!areVariationsLoading) {
            setSelectionManager(variableProduct.createSelectionManager());
        }
    }, [variableProduct, areVariationsLoading]);

    useEffect(() => {
        if (selectionManager) {
            const selectedVariation = selectionManager.getSelectedVariation();
            setProductVariation(selectedVariation);
        }
    }, [selectionManager, setProductVariation]);

    if (!selectionManager) {
        return <></>; // Or a loading indicator
    }

    const handleSelectOption = (attributeTaxonomy: string, optionSlug: string | null) => {
        const newManager = selectionManager.select(attributeTaxonomy, optionSlug);
        setSelectionManager(newManager);
    };

    const attributes = variableProduct.getAttributesForVariationSelection();

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
