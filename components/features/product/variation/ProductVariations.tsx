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

        <XStack justifyContent="space-between" gap={"$2"}>
            {variationAttributes.map((attribute) => {
                const currentSelection = selectedOptions[attribute.id];
                const options = attribute.options.filter((o) => o.name);
                const currentAvailableOptions = availableOptions.get(attribute.id);

                console.log(currentAvailableOptions?.get("Svart")?.map((o) => o.name));
                console.log(currentSelection);
                return (

                    <YStack key={attribute.id} flex={1}>
                        <CustomText style={{ marginTop: 8, marginBottom: 4 }}>{attribute.label}:</CustomText>
                        <AttributeSelector
                            attribute={attribute}
                            options={options}
                            currentSelection={currentSelection}
                            currentAvailableOptions={currentAvailableOptions}
                            handleOptionSelect={handleOptionSelect}
                            isLoading={isLoading}
                        />
                    </YStack>
                );
            })}

        </XStack>


    );
};
