import { useProductContext } from '@/contexts/ProductContext';
import React, { JSX } from 'react';
import { SizableText, XStack, YStack } from 'tamagui';
import { AttributeSelector } from './AttributeSelector';

export const ProductVariations = (): JSX.Element | null => {
    const {
        variationAttributes,
        selectedOptions,
        availableOptions,
        handleOptionSelect,
        isLoading,
        product
    } = useProductContext();

    if (!variationAttributes || variationAttributes.length === 0) {
        console.error("No variation attributes found! Product: ", product.id + " " + product.name);
        return null;
    }

    return (

        <XStack gap="$2" flexWrap="wrap">
            {variationAttributes.map((attribute, index) => {
                const currentSelection = selectedOptions[attribute.id];
                const options = attribute.options.filter((o) => o.name);
                const currentAvailableOptions = availableOptions.get(attribute.id);

                return (

                    <YStack key={attribute.id} flex={1}>
                        <SizableText fontSize="$3" fontWeight="bold" textTransform="capitalize" mb="$2" ml="$1">
                            {attribute.name}
                        </SizableText>
                        <AttributeSelector
                            attribute={attribute}
                            options={options}
                            currentSelection={currentSelection}
                            currentAvailableOptions={currentAvailableOptions}
                            handleOptionSelect={handleOptionSelect}
                            isLoading={isLoading}
                            selectedOptions={selectedOptions}
                            isFirst={index === 0}
                            isLast={index === variationAttributes.length - 1}
                        />
                    </YStack>
                );
            })}
        </XStack>


    );
};
