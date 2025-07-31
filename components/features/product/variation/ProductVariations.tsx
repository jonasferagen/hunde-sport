import { useProductContext } from '@/contexts/ProductContext';
import React, { JSX, useState } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

export const ProductVariations = (): JSX.Element => {
    const { product, isProductVariationsLoading } = useProductContext();
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string }>({});

    if (!product.hasVariations() || isProductVariationsLoading) {
        return <></>;
    }

    const handleSelectOption = (attributeId: number, option: string) => {
        const newSelectedOptions = { ...selectedOptions };

        if (newSelectedOptions[attributeId] === option) {
            delete newSelectedOptions[attributeId];
        } else {
            newSelectedOptions[attributeId] = option;
        }

        setSelectedOptions(newSelectedOptions);
        console.log('Selected option:', option);
        console.log('All selected options:', newSelectedOptions);
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
                            options={attribute.options}
                            selectedOptions={selectedOptions}
                            onSelectOption={handleSelectOption}
                        />
                    </YStack>
                );
            })}
        </XStack>
    );
};
