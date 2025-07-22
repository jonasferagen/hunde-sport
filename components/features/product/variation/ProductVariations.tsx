import { CustomText } from '@/components/ui/text/CustomText';
import { useProductContext } from '@/contexts/ProductContext';
import React, { JSX } from 'react';
import { XStack, YStack } from 'tamagui';
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

        <XStack space="$2" flexWrap="wrap">
            {variationAttributes.map((attribute, index) => {
                const currentSelection = selectedOptions[attribute.id];
                const options = attribute.options.filter((o) => o.name);
                const currentAvailableOptions = availableOptions.get(attribute.id);

                return (

                    <YStack key={attribute.id} flex={1}>
                        <CustomText fontSize="sm" bold>
                            {attribute.name}:
                        </CustomText>
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
