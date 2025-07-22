import { CustomText } from '@/components/ui/text/CustomText';
import { Product } from '@/models/Product';
import { ProductAttribute } from '@/models/ProductAttribute';
import React, { useState } from 'react';
import { Adapt, Select, Sheet, XStack } from 'tamagui';

interface AttributeSelectorProps {
    attribute: ProductAttribute;
    options: ProductAttribute['options'];
    currentSelection: string | undefined;
    currentAvailableOptions: Map<string, Product[]> | undefined;
    handleOptionSelect: (attributeId: number, optionName: string) => void;
    isLoading: boolean;
}

interface OptionRendererProps {
    option: any;
    disabled?: boolean;
    isSelected?: boolean;
}

const OptionRenderer = ({ option, disabled, isSelected }: OptionRendererProps) => {

    return (
        <XStack
            flex={1}
            backgroundColor={isSelected ? '$backgroundFocus' : 'transparent'}
            paddingVertical={"\$2"}
            paddingHorizontal={"\$3"}
            justifyContent='space-between'
            alignItems='center'
        >
            <XStack gap={"\$2"}>
                <CustomText style={{ fontWeight: isSelected ? 'bold' : 'normal', textDecorationLine: disabled ? 'line-through' : 'none' }}>
                    {option.label}
                </CustomText>
            </XStack>
        </XStack>
    );
};

export const AttributeSelector = ({ attribute, options, currentSelection, currentAvailableOptions, handleOptionSelect, isLoading }: AttributeSelectorProps) => {
    const useFullscreen = options.length > 10; // Adjust threshold as needed
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((o) => o.name === currentSelection);


    return (
        <Select
            key={`${attribute.id}-${currentSelection}`}
            value={currentSelection}
            onValueChange={(v) => { handleOptionSelect(attribute.id, v); setIsOpen(true) }}
            disablePreventBodyScroll
            onOpenChange={() => setIsOpen(true)}
        >
            <Select.Trigger >
                <Select.Value>
                    {selectedOption ? (
                        <OptionRenderer
                            option={selectedOption}
                        />
                    ) : (
                        'Velg et alternativ'
                    )}
                </Select.Value>
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
                    <Select.Group>
                        {options.map((option, index) => {
                            const matchingVariants = currentAvailableOptions?.get(option.name!)
                            const isDisabled = !matchingVariants || matchingVariants.length === 0;
                            const isSelected = currentSelection === option.name;
                            return (
                                <Select.Item
                                    key={option.name + attribute.id + index}
                                    index={index}
                                    value={option.name!}
                                    disabled={isDisabled}

                                >
                                    <OptionRenderer
                                        option={option}
                                        disabled={isDisabled}
                                        isSelected={isSelected}
                                    />
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
