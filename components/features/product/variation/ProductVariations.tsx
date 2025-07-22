import { Loader } from '@/components/ui';
import { CustomText } from '@/components/ui/text/CustomText';
import { useProductContext } from '@/contexts/ProductContext';
import { ProductAttribute } from '@/models/ProductAttribute';
import React, { JSX, useState } from 'react';
import { Adapt, Select, Sheet, XStack, YStack } from 'tamagui';
import { PriceTag } from '../display/PriceTag';
import { ProductStatus } from '../display/ProductStatus';



interface VariationSelectorProps {
    attribute: ProductAttribute;
    options: ProductAttribute['options'];
    currentSelection: string | undefined;
    availableOptions: Map<number, Map<string, any>>;
    handleOptionSelect: (attributeId: number, optionName: string) => void;
    isLoading: boolean;
}


interface OptionRendererProps {
    option: any;
    attribute: ProductAttribute;
    currentSelection: string | undefined;
    availableOptions: Map<number, Map<string, any>>;
    handleOptionSelect: (attributeId: number, optionName: string) => void;
    isLoading: boolean;
}

const OptionRenderer = ({ option, attribute, currentSelection, availableOptions, handleOptionSelect, isLoading }: OptionRendererProps) => {
    const isSelected = currentSelection === option.name;
    const isDisabled = !availableOptions.get(attribute.id)?.has(option.name!);
    const variant = availableOptions.get(attribute.id)?.get(option.name!);
    const waiting = isLoading && !variant;
    const unavailable = !variant && !isLoading;

    return (

        <XStack
            flex={1}
            backgroundColor={isSelected ? '$backgroundFocus' : 'transparent'}
            paddingVertical={"$2"}
            paddingHorizontal={"$3"}
            justifyContent='space-between'
            alignItems='center'
            disabled={isDisabled}
        >
            <XStack gap={"$2"}>
                <CustomText style={{ fontWeight: isSelected ? 'bold' : 'normal', opacity: isDisabled ? 0.5 : 1 }}>
                    {option.label}
                </CustomText>
                {variant && <ProductStatus displayProduct={variant} fontSize="sm" short={true} />}
            </XStack>
            <YStack>
                <XStack flex={1} gap={"$2"}>
                    {variant && <PriceTag product={variant} />}
                    {waiting && <Loader size='small' />}
                    {unavailable && <CustomText fontSize="xs" bold color='grey'>Ikke tilgjengelig</CustomText>}
                </XStack>
            </YStack>
        </XStack>

    );
};


const DropdownVariationSelector = ({ attribute, options, currentSelection, availableOptions, handleOptionSelect, isLoading }: VariationSelectorProps) => {
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
                            attribute={attribute}
                            currentSelection={currentSelection}
                            availableOptions={availableOptions}
                            handleOptionSelect={handleOptionSelect}
                            isLoading={isLoading}
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

                                    borderColor="red"
                                    borderWidth={1}
                                >
                                    <OptionRenderer
                                        option={option}
                                        attribute={attribute}
                                        currentSelection={currentSelection}
                                        availableOptions={availableOptions}
                                        handleOptionSelect={handleOptionSelect}
                                        isLoading={isLoading}
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

                return (

                    <YStack key={attribute.id} flex={1}>
                        <CustomText style={{ marginTop: 8, marginBottom: 4 }}>{attribute.label}:</CustomText>
                        <DropdownVariationSelector
                            attribute={attribute}
                            options={options}
                            currentSelection={currentSelection}
                            availableOptions={availableOptions}
                            handleOptionSelect={handleOptionSelect}
                            isLoading={isLoading}
                        />
                    </YStack>
                );
            })}

        </XStack>


    );
};
