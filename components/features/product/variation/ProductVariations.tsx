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
    } = useProductContext();

    if (!variationAttributes || variationAttributes.length === 0) {
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
                        <SizableText fontSize="$3" >
                            {attribute.name}:
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
