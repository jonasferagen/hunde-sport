import { Loader } from '@/components/ui';
import { CustomText } from '@/components/ui/text/CustomText';
import { useProductContext } from '@/contexts/ProductContext';
import { ProductAttribute } from '@/models/ProductAttribute';
import React, { JSX } from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack } from 'tamagui';

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
                <XStack gap={"$2"} style={{ borderColor: 'green', borderWidth: 1 }}>
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

const variationSelectors = {
    list: ListVariationSelector,
};

interface ProductVariationsProps {
    displayAs?: keyof typeof variationSelectors;
}

export const ProductVariations = ({ displayAs = 'list' }: ProductVariationsProps): JSX.Element | null => {
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
