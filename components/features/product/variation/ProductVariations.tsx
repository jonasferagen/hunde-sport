import { Loader } from '@/components/ui';
import { Col, Row } from '@/components/ui/layout';
import { CustomText } from '@/components/ui/text/CustomText';
import { useProductContext } from '@/contexts/ProductContext';
import { ProductAttribute } from '@/models/ProductAttribute';
import { SPACING } from '@/styles';
import React, { JSX, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Menu } from 'react-native-paper';
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
            <Row style={{ backgroundColor: isSelected ? 'lightgray' : 'transparent', paddingVertical: SPACING.sm, paddingHorizontal: SPACING.sm }}>
                <Row>
                    <CustomText style={{ fontWeight: isSelected ? 'bold' : 'normal', opacity: isDisabled ? 0.5 : 1, paddingVertical: 4 }}>
                        {option.label}
                    </CustomText>
                    {variant && <ProductStatus displayProduct={variant} fontSize="xs" short={true} />}
                </Row>
                <Col alignItems='flex-end'>
                    <Row justifyContent='flex-end'>
                        {variant && <PriceTag product={variant} />}
                        {waiting && <Loader size='small' />}
                        {unavailable && <CustomText fontSize="xs" bold color='grey'>Ikke tilgjengelig</CustomText>}
                    </Row>
                </Col>
            </Row>
        </Pressable>
    );
};

const SelectVariationSelector = ({ attribute, options, currentSelection, availableOptions, handleOptionSelect, isLoading }: VariationSelectorProps) => {
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const selectedLabel = options.find(o => o.name === currentSelection)?.label || 'Velg...';

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<Button onPress={openMenu}>{selectedLabel}</Button>}
            >
                {options.map((option) => (
                    <Menu.Item
                        key={option.name}
                        onPress={() => {
                            handleOptionSelect(attribute.id, option.name!);
                            closeMenu();
                        }}
                        title={<OptionRenderer
                            option={option}
                            attribute={attribute}
                            currentSelection={currentSelection}
                            availableOptions={availableOptions}
                            handleOptionSelect={() => { }}
                            isLoading={isLoading}
                        />}
                    />
                ))}
            </Menu>
        </View>
    );
};

const ListVariationSelector = ({ attribute, options, currentSelection, availableOptions, handleOptionSelect, isLoading }: VariationSelectorProps) => (
    <View>
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
    </View >
);

const variationSelectors = {
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

const styles = StyleSheet.create({
    selectContainer: {
        position: 'relative',
        zIndex: 1,
    },
    selectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
    },
    optionsContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        marginTop: 4,
        zIndex: 2, // Ensure it's above other content
    },
});
