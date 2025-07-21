import { Loader } from '@/components/ui';
import { CustomText } from '@/components/ui/text/CustomText';
import { useProductContext } from '@/contexts/ProductContext';
import { ProductAttribute } from '@/models/ProductAttribute';
import React, { JSX } from 'react';
import { Pressable } from 'react-native';
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
        <Pressable key={option.name} onPress={() => !isDisabled && handleOptionSelect(attribute.id, option.name!)} disabled={isDisabled}>
            <XStack
                backgroundColor={isSelected ? '$backgroundFocus' : 'transparent'}
                paddingVertical={"$2"}
                paddingHorizontal={"$3"}
                justifyContent='space-between'
                alignItems='center'
            >
                <XStack gap={"$2"}>
                    <CustomText style={{ fontWeight: isSelected ? 'bold' : 'normal', opacity: isDisabled ? 0.5 : 1 }}>
                        {option.label}
                    </CustomText>
                    {variant && <ProductStatus displayProduct={variant} fontSize="sm" short={true} />}
                </XStack>
                <YStack>
                    <XStack gap={"$2"}>
                        {variant && <PriceTag product={variant} />}
                        {waiting && <Loader size='small' />}
                        {unavailable && <CustomText fontSize="xs" bold color='grey'>Ikke tilgjengelig</CustomText>}
                    </XStack>
                </YStack>
            </XStack>
        </Pressable>
    );
};


const ListVariationSelector = ({ attribute, options, currentSelection, availableOptions, handleOptionSelect, isLoading }: VariationSelectorProps) => (
    <YStack>
        {options.map((option) => (
            <OptionRenderer
                key={option.name}
                option={option}
                attribute={attribute}
                currentSelection={currentSelection}
                availableOptions={availableOptions}
                handleOptionSelect={handleOptionSelect}
                isLoading={isLoading}
            />
        ))}
    </YStack >
);

const SelectOptionRenderer = ({ option, attribute, availableOptions, isLoading }: Omit<OptionRendererProps, 'handleOptionSelect' | 'currentSelection'>) => {
    const isDisabled = !availableOptions.get(attribute.id)?.has(option.name!);
    const variant = availableOptions.get(attribute.id)?.get(option.name!);
    const waiting = isLoading && !variant;
    const unavailable = !variant && !isLoading;

    return (
        <XStack
            flex={1}
            justifyContent='space-between'
            alignItems='center'
            opacity={isDisabled ? 0.5 : 1}
        >
            <XStack flex={1} alignItems='center' gap={"$2"}>
                <CustomText>
                    {option.label}
                </CustomText>
                {variant && <ProductStatus displayProduct={variant} fontSize="xs" short={true} />}
            </XStack>
            <XStack justifyContent='flex-end' alignItems='center' gap={"$2"}>
                {variant && <PriceTag product={variant} />}
                {waiting && <Loader size='small' />}
                {unavailable && <CustomText fontSize="xs" bold color='grey'>Ikke tilgjengelig</CustomText>}
            </XStack>
        </XStack>
    );
};

const DropdownVariationSelector = ({ attribute, options, currentSelection, availableOptions, handleOptionSelect, isLoading }: VariationSelectorProps) => {
    return (
        <Select
            value={currentSelection}
            onValueChange={(v) => handleOptionSelect(attribute.id, v)}
        >
            <Select.Trigger>
                <Select.Value placeholder="Velg et alternativ" />
            </Select.Trigger>

            <Adapt when="maxMd" platform="touch">
                <Sheet native modal dismissOnSnapToBottom animation="medium">
                    <Sheet.Frame>
                        <Sheet.ScrollView>
                            <Adapt.Contents />
                        </Sheet.ScrollView>
                    </Sheet.Frame>
                    <Sheet.Overlay
                        backgroundColor="$shadowColor"
                        animation="lazy"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                </Sheet>
            </Adapt>


            <Select.Content zIndex={2000}>

                <Select.ScrollUpButton />
                <Select.Viewport>
                    <Select.Group>
                        {options.map((option, index) => {
                            const isDisabled = !availableOptions
                                .get(attribute.id)
                                ?.has(option.name!)
                            return (
                                <Select.Item
                                    key={option.name}
                                    index={index}
                                    value={option.name!}
                                    disabled={isDisabled}
                                >
                                    <Select.ItemText>
                                        <SelectOptionRenderer
                                            option={option}
                                            attribute={attribute}
                                            availableOptions={availableOptions}
                                            isLoading={isLoading}
                                        />
                                    </Select.ItemText>
                                </Select.Item>
                            )
                        })}
                    </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton />
            </Select.Content>
        </Select>
    )

}


const variationSelectors = {
    list: ListVariationSelector,
    dropdown: DropdownVariationSelector,
};

interface ProductVariationsProps {
    displayAs?: keyof typeof variationSelectors;
}

export const ProductVariations = ({ displayAs = 'dropdown' }: ProductVariationsProps): JSX.Element | null => {
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

    const Component = variationSelectors[displayAs];

    return (
        <YStack>
            {variationAttributes.map((attribute) => {
                const currentSelection = selectedOptions[attribute.id];
                const options = attribute.options.filter((o) => o.name);

                return (
                    <React.Fragment key={attribute.id}>
                        <CustomText style={{ marginTop: 8, marginBottom: 4 }}>{attribute.label}:</CustomText>
                        <Component
                            attribute={attribute}
                            options={options}
                            currentSelection={currentSelection}
                            availableOptions={availableOptions}
                            handleOptionSelect={handleOptionSelect}
                            isLoading={isLoading}
                        />
                    </React.Fragment>
                );
            })}
        </YStack>
    );
};
