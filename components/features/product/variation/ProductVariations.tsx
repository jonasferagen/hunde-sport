import { useProductContext } from '@/contexts/ProductContext';
import { ProductAttribute } from '@/models/ProductAttribute';
import { VariableProduct } from '@/types';
import React, { JSX, useState } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

const findVariations = (product: VariableProduct, selectedOptions: { [key: string]: string }) => {
    const filteredVariations = product.variations.filter((variation) => {
        return Object.entries(selectedOptions).every(([name, value]) => {
            return variation.attributes.some((attribute) => attribute.name === name && attribute.value === value);
        });
    });

    return filteredVariations;
};

export const ProductVariations = (): JSX.Element => {
    const { product, productVariations, isProductVariationsLoading } = useProductContext();
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
    const [matchingVariations, setMatchingVariations] = useState(() =>
        findVariations(product as VariableProduct, {})
    );

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

        const variations = findVariations(product as VariableProduct, newSelectedOptions);
        setMatchingVariations(variations);

        const totalAttributes = product.attributes.filter((attr) => attr.variation).length;
        if (Object.keys(newSelectedOptions).length === totalAttributes && totalAttributes > 0) {
            if (variations.length !== 1) {
                console.error(
                    'Expected to find exactly one variation, but found ' + variations.length,
                    variations
                );
            } else {
                const finalVariationId = variations[0].id;
                const fullVariation = productVariations.find((v) => v.id === finalVariationId);
                if (fullVariation) {
                    console.log('Final selected product variation:', fullVariation);
                    //  setProductVariation(fullVariation);
                } else {
                    console.error('Could not find the full variation object for id:', finalVariationId);
                }
            }
        }
    };

    const attributes = product.attributes.filter((attribute) => attribute.variation);
    const allVariationAttributes = (product as VariableProduct).variations.flatMap((v) => v.attributes);

    return (
        <XStack gap="$2" flexWrap="wrap">
            {attributes.map((attribute) => {
                const availableTerms = attribute.terms.filter((term) =>
                    allVariationAttributes.some((varAttr) => varAttr.name === attribute.name && varAttr.value === term.slug)
                );

                if (availableTerms.length === 0) {
                    return null;
                }

                const filteredAttribute = new ProductAttribute({ ...attribute, terms: availableTerms });

                return (
                    <YStack key={attribute.id} flex={1} mb="$3">
                        {attributes.length > 1 && (
                            <SizableText fontSize="$3" fontWeight="bold" textTransform="capitalize" mb="$2" ml="$1">
                                {attribute.name}
                            </SizableText>
                        )}
                        <AttributeSelector
                            attribute={filteredAttribute}
                            productVariations={matchingVariations}
                            selectedOptions={selectedOptions}
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
