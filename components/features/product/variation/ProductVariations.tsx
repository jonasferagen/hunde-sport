import { CustomText } from '@/components/ui/text/CustomText';
import { useProductContext } from '@/contexts/ProductContext';
import { ProductAttribute } from '@/models/ProductAttribute';
import React, { JSX, useState } from 'react';
import { View } from 'react-native';
import { Adapt, Select, Sheet, XStack } from 'tamagui';

interface VariationSelectorProps {
    attribute: ProductAttribute;
    options: ProductAttribute['options'];
    currentSelection: string | undefined;
    availableOptions: Map<number, Map<string, any>>;
    handleOptionSelect: (attributeId: number, optionName: string) => void;
    isLoading: boolean;
}

const DropdownVariationSelector = ({ attribute, options, currentSelection, availableOptions, handleOptionSelect, isLoading }: VariationSelectorProps) => {
    const useFullscreen = options.length > 10; // Adjust threshold as needed
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Select
            key={`${attribute.id}-${currentSelection}`}
            value={currentSelection}
            onValueChange={(v) => { handleOptionSelect(attribute.id, v); setIsOpen(false) }}
            disablePreventBodyScroll
            onOpenChange={setIsOpen}

        >
            <Select.Trigger >
                <Select.Value placeholder="Velg et alternativ" />
            </Select.Trigger>
            {useFullscreen && (
                <Adapt platform="touch">
                    <Sheet modal dismissOnSnapToBottom snapPoints={[90]} animation="medium">
                        <Sheet.Overlay
                            backgroundColor="$shadowColor"
                            animation="medium"
                            enterStyle={{ opacity: 0 }}
                            exitStyle={{ opacity: 0 }}
                        />
                        <Sheet.Frame padding="$4">
                            <Sheet.ScrollView>
                                <Adapt.Contents />
                            </Sheet.ScrollView>
                        </Sheet.Frame>
                    </Sheet>
                </Adapt>
            )}
            <Select.Content zIndex={2000} >
                <Select.ScrollUpButton />
                <Select.Viewport>
                    <Select.Group display={isOpen ? 'flex' : 'none'}>
                        {options.map((option, index) => {
                            const isDisabled = !availableOptions
                                .get(attribute.id)
                                ?.has(option.name!)
                            return (
                                <Select.Item
                                    key={option.name + attribute.id + index}
                                    index={index}
                                    value={option.name!}
                                    disabled={isDisabled}
                                    flex={1}
                                    visibility='visible'
                                >
                                    <Select.ItemText key={option.name + attribute.id + index}>{option.name}</Select.ItemText>
                                </Select.Item>
                            )
                        })}
                    </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton />
            </Select.Content>
        </Select >
    )
}




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
        <View>
            <XStack>
                {variationAttributes.map((attribute) => {
                    const currentSelection = selectedOptions[attribute.id];
                    const options = attribute.options.filter((o) => o.name);

                    return (

                        <View key={attribute.id}>
                            <CustomText style={{ marginTop: 8, marginBottom: 4 }}>{attribute.label}:</CustomText>
                            <DropdownVariationSelector
                                attribute={attribute}
                                options={options}
                                currentSelection={currentSelection}
                                availableOptions={availableOptions}
                                handleOptionSelect={handleOptionSelect}
                                isLoading={isLoading}
                            />
                        </View>
                    );
                })}

            </XStack>

        </View>
    );
};
