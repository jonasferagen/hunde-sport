import { useProductContext } from '@/contexts/ProductContext';
import { VariableProduct } from '@/types';
import React, { JSX, useState } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

const findVariations = (product: VariableProduct, selectedOptions: { [key: string]: string }) => {

};


export const ProductVariations = (): JSX.Element => {
    const { product, isProductVariationsLoading } = useProductContext();
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

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
        console.log('All selected options:', newSelectedOptions);

        console.log(product.variations[0].attributes);
    };

    const attributes = product.attributes.filter((attribute) => attribute.variation);

    return (
        <XStack gap="$2" flexWrap="wrap">
            {attributes.map((attribute) => {
                return (
                    <YStack key={attribute.id} flex={1} mb="$3">
                        {attributes.length > 1 && (
                            <SizableText fontSize="$3" fontWeight="bold" textTransform="capitalize" mb="$2" ml="$1">
                                {attribute.name}
                            </SizableText>
                        )}
                        <AttributeSelector
                            attribute={attribute}
                            selectedOption={selectedOptions[attribute.name]}
                            onSelectOption={(optionLabel) => {
                                const term = attribute.terms.find((t) => t.name === optionLabel);
                                if (term) {
                                    handleSelectOption(attribute.name, term.slug);
                                }
                            }}
                        />
                    </YStack>
                );
            })}
        </XStack>
    );
};
