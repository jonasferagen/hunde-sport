import { useProductContext } from '@/contexts/ProductContext';
import { ProductAttribute } from '@/models/Product/ProductAttribute';
import { ProductVariation } from '@/models/Product/ProductVariation';
import { VariableProduct } from '@/models/Product/VariableProduct';
import React, { JSX, useMemo, useState } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

const findVariations = (
    product: VariableProduct,
    productVariations: ProductVariation[],
    selectedOptions: { [key: string]: string }
): ProductVariation[] => {
    const filteredVariationReferences = product.variations.filter((variation) => {
        return Object.entries(selectedOptions).every(([name, value]) => {
            return variation.attributes.some((attribute) => attribute.name === name && attribute.value === value);
        });
    });

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

        const variations = findVariations(product as VariableProduct, productVariations, newSelectedOptions);

        const totalAttributes = product.attributes.filter((attr) => attr.variation).length;
        if (Object.keys(newSelectedOptions).length === totalAttributes && totalAttributes > 0) {
            if (variations.length === 1) {
                const finalVariationId = variations[0].id;
                const fullVariation = productVariations.find((v) => v.id === finalVariationId);
                if (fullVariation) {
                    setProductVariation(fullVariation);
                }
            } else {
                setProductVariation(undefined);
            }
        } else {
            setProductVariation(undefined);
        }
    };



    const attributes = product.attributes.filter((attribute) => attribute.variation);
    const allVariationAttributes = (product as VariableProduct).variations.flatMap((v) => v.attributes);


    return <XStack gap="$2" flexWrap="wrap" mt="$2">
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
                        <SizableText fos="$3" fow="bold" textTransform="capitalize" mb="$2" ml="$1">
                            {attribute.name}
                        </SizableText>
                    )}
                    <AttributeSelector
                        attribute={filteredAttribute}
                        productVariations={productVariations}
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
    </XStack>;

};
