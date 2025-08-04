import { useProductContext } from '@/contexts/ProductContext';
import { ProductAttribute } from '@/models/Product/ProductAttribute';
import { VariableProduct } from '@/models/Product/VariableProduct';
import React, { JSX, useEffect, useMemo, useState } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

export const ProductVariations = (): JSX.Element => {
    const { product, productVariation, setProductVariation, isProductVariationsLoading } = useProductContext();

    const productVariations = (product as VariableProduct).getVariationsData();

    const initialSelections = useMemo(() => {
        if (!productVariation) {
            return {};
        }
        return productVariation.variation_attributes.reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
        }, {} as { [key: string]: string });
    }, [productVariation]);

    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>(initialSelections);

    useEffect(() => {
        if (!(product instanceof VariableProduct)) {
            return;
        }
        const attributes = Object.entries(selectedOptions).map(([name, option]) => new ProductAttribute({ id: 0, name, option }));
        const matchingVariations = product.findVariations(attributes);

        if (matchingVariations.length === 1) {
            setProductVariation(matchingVariations[0]);
        } else {
            setProductVariation(undefined as any);
        }
    }, [selectedOptions, product, productVariations, setProductVariation]);

    if (!product.hasVariations() || isProductVariationsLoading) {
        return <></>;
    }

    const handleSelectOption = (attributeName: string, optionValue: string) => {
        const newSelectedOptions = { ...selectedOptions };

        if (newSelectedOptions[attributeName] === optionValue) {
            delete newSelectedOptions[attributeName];
        } else {
            newSelectedOptions[attributeName] = optionValue;
        }

        setSelectedOptions(newSelectedOptions);
    };

    const attributes = (product as VariableProduct).getAttributesForVariationSelection();


    return (
        <XStack gap="$2" flexWrap="wrap" mt="$2">
            {attributes.map((attribute) => {
                return (
                    <YStack key={attribute.id} flex={1}>
                        <SizableText fos="$3" fow="bold" mb="$2" ml="$1" tt="capitalize">
                            {attribute.name}
                        </SizableText>
                        <AttributeSelector
                            attribute={attribute}
                            selectedValue={selectedOptions[attribute.name]}
                            onSelect={(value) => handleSelectOption(attribute.name, value)}
                        />
                    </YStack>
                );
            })}
        </XStack>
    );
};
