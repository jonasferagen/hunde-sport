import { Loader } from '@/components/ui';
import { Col, Row } from '@/components/ui/layout';
import { Select } from '@/components/ui/select/Select';
import { CustomText } from '@/components/ui/text/CustomText';
import { useProductContext } from '@/contexts/ProductContext';
import { ProductAttribute } from '@/models/ProductAttribute';
import { SPACING } from '@/styles';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { PriceTag } from '../display/PriceTag';
import { ProductStatus } from '../display/ProductStatus';
import { VariationChip } from './VariationChip';

interface VariationSelectorProps {
    attribute: ProductAttribute;
    options: ProductAttribute['options'];
    currentSelection: string | undefined;
    availableOptions: Map<number, Map<string, any>>;
    handleOptionSelect: (attributeId: number, optionName: string) => void;
    isLoading: boolean;
}

const ChipVariationSelector = ({ attribute, options, currentSelection, availableOptions, handleOptionSelect }: Omit<VariationSelectorProps, 'isLoading'>) => (
    <Row style={{ flexWrap: 'wrap', marginBottom: 8 }}>
        {options.map((option) => (
            <VariationChip
                key={`${attribute.id}-${option.name}`}
                label={option.label}
                onPress={() => handleOptionSelect(attribute.id, option.name!)}
                disabled={!availableOptions.get(attribute.id)?.has(option.name!)}
                isSelected={currentSelection === option.name}
            />
        ))}
    </Row>
);

const SelectVariationSelector = ({ attribute, options, currentSelection, handleOptionSelect }: Omit<VariationSelectorProps, 'isLoading'>) => (
    <Select
        label=""
        selectedValue={currentSelection}
        onValueChange={(value) => handleOptionSelect(attribute.id, value as string)}
        options={options.map((opt) => ({
            label: opt.label,
            value: opt.name!,
        }))}
    />
);

const ListVariationSelector = ({ attribute, options, currentSelection, availableOptions, handleOptionSelect, isLoading }: VariationSelectorProps) => (
    <View>
        {options.map((option) => {
            const isSelected = currentSelection === option.name;
            const isDisabled = !availableOptions.get(attribute.id)?.has(option.name!);
            const variant = availableOptions.get(attribute.id)?.get(option.name!);
            const waiting = isLoading && !variant;
            const unavailable = !variant && !isLoading;
            return (
                <Pressable key={option.name} onPress={() => !isDisabled && handleOptionSelect(attribute.id, option.name!)} disabled={isDisabled}>
                    <Row>
                        <Row style={{ gap: SPACING.sm }}>
                            <CustomText style={{ fontWeight: isSelected ? 'bold' : 'normal', opacity: isDisabled ? 0.5 : 1, paddingVertical: 4 }}>
                                {option.label}
                            </CustomText>
                            {variant && <ProductStatus displayProduct={variant} fontSize="xs" short={true} />}
                        </Row>
                        <Col alignItems='flex-end'>
                            <Row justifyContent='flex-end' style={{ gap: SPACING.sm }}>
                                {variant && <PriceTag product={variant} />}
                                {waiting && <Loader size='small' />}
                                {unavailable && <CustomText fontSize="xs" bold color='grey'>Ikke tilgjengelig</CustomText>}
                            </Row>
                        </Col>
                    </Row>
                </Pressable>
            );
        })}
    </View >
);

const variationSelectors = {
    chips: ChipVariationSelector,
    select: SelectVariationSelector,
    list: ListVariationSelector,
};

interface ProductVariationsProps {
    displayAs?: keyof typeof variationSelectors;
}

export const ProductVariations = ({ displayAs = 'select' }: ProductVariationsProps): JSX.Element | null => {
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

    const Component = variationSelectors[displayAs] || SelectVariationSelector;

    return (
        <Col>
            {variationAttributes.map((attribute) => {
                const currentSelection = selectedOptions[attribute.id];
                const options = attribute.options.filter((o) => o.name);

                return (
                    <React.Fragment key={attribute.id}>
                        <Text style={{ marginTop: 8, marginBottom: 4 }}>{attribute.label}:</Text>
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
        </Col>
    );
};
