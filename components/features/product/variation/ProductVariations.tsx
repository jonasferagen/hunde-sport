import { useProductContext } from '@/contexts/ProductContext';
import { ProductAttribute } from '@/models/Product/ProductAttribute';
import { ProductVariation } from '@/models/Product/ProductVariation';
import { VariableProduct } from '@/models/Product/VariableProduct';
import React, { JSX, useMemo, useState } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

/**
 * Finds product variations that strictly match the set of selected attribute options.
 * An empty selection will result in no matches.
 */
const findVariations = (
    product: VariableProduct,
    productVariations: ProductVariation[],
    selectedOptions: { [key: string]: string }
): ProductVariation[] => {
    // If no options are selected, no specific variation can be matched.
    if (Object.keys(selectedOptions).length === 0) {
        return [];
    }

    const selectedEntries = Object.entries(selectedOptions);

    const filteredVariationReferences = product.variations.filter((variation) =>
        // The variation must have the same number of attributes as the selection.
        variation.attributes.length === selectedEntries.length &&
        // And every selected option must be present in the variation's attributes.
        selectedEntries.every(([name, value]) =>
            variation.attributes.some((attr) => attr.name === name && attr.value === value)
        )
    );

    const foundIds = new Set(filteredVariationReferences.map((v) => v.id));
    return productVariations.filter((v) => foundIds.has(v.id));
};

export const ProductVariations = (): JSX.Element => {
    const { product, productVariations, productVariation, setProductVariation, isProductVariationsLoading } =
        useProductContext();

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

        const matchingVariations = findVariations(
            product as VariableProduct,
            productVariations,
            newSelectedOptions
        );

        // If exactly one variation matches the selection, set it.
        // Otherwise, clear the selection.
        if (matchingVariations.length === 1) {
            setProductVariation(matchingVariations[0]);
        } else {
            setProductVariation(undefined);
        }
    };

    const attributes = product.attributes.filter((attribute) => attribute.variation);
    const allVariationAttributes = (product as VariableProduct).variations.flatMap((v) => v.attributes);

    return (
        <XStack gap="$2" flexWrap="wrap" mt="$2">
            {attributes.map((attribute) => {
                const availableTerms = attribute.terms.filter((term) =>
                    allVariationAttributes.some((varAttr) => varAttr.name === attribute.name && varAttr.value === term.slug)
                );

                if (availableTerms.length === 0) {
                    return null;
                }

                const filteredAttribute = new ProductAttribute({ ...attribute, terms: availableTerms });

                return (
                    <YStack key={attribute.id} flex={1}>
                        {attributes.length > 1 && (
                            <SizableText fos="$3" fow="bold" mb="$2" ml="$1" textTransform="capitalize">
                                {attribute.name}
                            </SizableText>
                        )}
                        <AttributeSelector
                            attribute={filteredAttribute}
                            productVariations={productVariations}
                            selectedOptions={selectedOptions}
                            onSelectOption={(optionLabel) => {
                                const term = attribute.terms.find((t) => t.name === optionLabel);
                                term && handleSelectOption(attribute.name, term.slug);
                            }}
                        />
                    </YStack>
                );
            })}
        </XStack>
    );
};
