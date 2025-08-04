import { useProductContext } from '@/contexts/ProductContext';
import { useProductVariations } from '@/hooks/data/Product';
import { ProductAttribute } from '@/models/Product/ProductAttribute';
import { AttributeSelectionTuple } from '@/models/Product/ProductVariation';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { VariationSelection } from '@/models/Product/VariationSelection';
import React, { JSX, useEffect, useMemo, useState } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

export const ProductVariations = (): JSX.Element => {
    const { product, productVariation, setProductVariation, isProductVariationsLoading } = useProductContext();

    if (!(product instanceof VariableProduct)) {
        return <></>;
    }

    const variableProduct = product as VariableProduct;

    const { isLoading: areVariationsLoading } = useProductVariations(variableProduct);

    useEffect(() => {
        variableProduct.setVariationsLoading(areVariationsLoading);
    }, [variableProduct, areVariationsLoading]);

    const initialSelections = useMemo(() => {
        if (!productVariation) {
            return {};
        }
        return productVariation.variation_attributes.reduce((acc, attr) => {
            acc[attr.name] = attr.option;
            return acc;
        }, {} as { [key: string]: string });
    }, [productVariation]);

    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>(initialSelections);

    useEffect(() => {
        const selections: AttributeSelectionTuple[] = Object.entries(selectedOptions).map(([name, option]) => ({ name, option }));
        const matchingVariations = variableProduct.findVariations(selections);

        if (matchingVariations.length === 1) {
            setProductVariation(matchingVariations[0]);
        } else {
            setProductVariation(undefined as any);
        }
    }, [selectedOptions, variableProduct, setProductVariation]);

    if (isProductVariationsLoading) {
        return <></>;
    }

    const handleSelectOption = (attributeTaxonomy: string, optionValue: string) => {
        const newSelectedOptions = { ...selectedOptions };

        if (newSelectedOptions[attributeTaxonomy] === optionValue) {
            delete newSelectedOptions[attributeTaxonomy];
        } else {
            newSelectedOptions[attributeTaxonomy] = optionValue;
        }

        setSelectedOptions(newSelectedOptions);
    };

    const attributes = variableProduct.getAttributesForVariationSelection();
    const selection = new VariationSelection(selectedOptions);

    return (
        <XStack gap="$2" flexWrap="wrap" mt="$2">
            {attributes.map((attribute: ProductAttribute) => {
                const options = variableProduct.getAttributeOptions(attribute.taxonomy, selection);

                return (
                    <YStack key={attribute.id} flex={1}>
                        <SizableText fos="$3" fow="bold" mb="$2" ml="$1" tt="capitalize">
                            {attribute.name}
                        </SizableText>
                        <AttributeSelector
                            options={options}
                            selectedValue={selectedOptions[attribute.taxonomy]}
                            onSelect={(value) => handleSelectOption(attribute.taxonomy, value)}
                        />
                    </YStack>
                );
            })}
        </XStack>
    );
};
