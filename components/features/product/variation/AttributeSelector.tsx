
import { calculatePriceRange } from '@/contexts/ProductContext';
import { Product } from '@/models/Product';
import { ProductAttribute } from '@/models/ProductAttribute';
import { ProductAttributeOption } from '@/types';
import { formatPriceRange } from '@/utils/helpers';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { Pressable } from 'react-native';
import { SizableText, Spinner, ThemeName, XStack, YStack } from 'tamagui';
import { VariantInfo } from '../display/VariantInfo';

const getThemeName = (name: string): ThemeName => name as ThemeName;

interface AttributeSelectorProps {
    attribute: ProductAttribute;
    options: ProductAttribute['options'];
    currentSelection: string | undefined;
    currentAvailableOptions: Map<string, Product[]> | undefined;
    handleOptionSelect: (attributeId: number, optionName: string) => void;
    isLoading: boolean;
    selectedOptions: Record<number, string>;
    isFirst: boolean;
    isLast: boolean;
}

interface OptionRendererProps {
    option: ProductAttributeOption;
    disabled?: boolean;
    isSelected?: boolean;
    matchingVariants?: Product[];
    selectedOptions: Record<number, string>;
    isFirst: boolean;
    isLast: boolean;
    isLoading: boolean;
}


const OptionRenderer = ({
    option,
    disabled,
    isSelected,
    matchingVariants,
    isLoading }: OptionRendererProps) => {
    const opacity = 1;
    const fontSize = "$3";
    const priceRange = calculatePriceRange(matchingVariants);
    return (
        <XStack
            flex={1}
            theme={isSelected ? getThemeName('primary') : null}
            backgroundColor={isSelected ? '$background' : 'transparent'}
            paddingVertical={"$3"}
            paddingHorizontal={"$2"}
            justifyContent='space-between'
            alignItems='center'
            cursor={disabled ? 'not-allowed' : 'pointer'}
            opacity={disabled ? 0.5 : 1}
        >
            <XStack gap={"$2"}>
                <SizableText
                    textTransform="capitalize"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textDecorationLine={disabled ? 'line-through' : 'none'}
                    color={'$color'}
                >
                    {option.label}
                </SizableText>
            </XStack>
            <XStack alignItems='flex-end'>
                <SizableText opacity={opacity} fontSize={fontSize} color={'$color'}>
                    {isLoading ? <Spinner /> : matchingVariants && matchingVariants.length === 1 ? (
                        <VariantInfo variant={matchingVariants[0]} />
                    ) : matchingVariants && matchingVariants.length > 1 ? (
                        formatPriceRange(priceRange!)
                    ) : null}
                </SizableText>
            </XStack>

        </XStack>
    );
};

export const AttributeSelector = ({ attribute, options, currentSelection, currentAvailableOptions, handleOptionSelect, isLoading, selectedOptions, isFirst, isLast }: AttributeSelectorProps) => {

    const renderItem = ({ item: option }: { item: ProductAttributeOption }) => {
        const matchingVariants = currentAvailableOptions?.get(option.name!)
        const singleVariant = matchingVariants && matchingVariants.length === 1 ? matchingVariants[0] : null;
        const isOutOfStock = singleVariant ? singleVariant.stock_status === 'outofstock' : false;
        const isDisabled = !matchingVariants || matchingVariants.length === 0 || isOutOfStock;
        const isSelected = currentSelection === option.name;

        return (
            <Pressable
                onPress={() => !isDisabled && handleOptionSelect(attribute.id, option.name!)}
                disabled={isDisabled}
            >
                <OptionRenderer
                    option={option}
                    disabled={isDisabled}
                    isSelected={isSelected}
                    matchingVariants={matchingVariants}
                    selectedOptions={selectedOptions}
                    isFirst={isFirst}
                    isLast={isLast}
                    isLoading={isLoading}
                />
            </Pressable>
        );
    };


    const ITEM_HEIGHT = 60; // Approximate item height
    const MAX_ITEMS_VISIBLE = 10;

    return (
        <YStack maxHeight={options.length > MAX_ITEMS_VISIBLE ? ITEM_HEIGHT * MAX_ITEMS_VISIBLE : undefined} flex={1}>
            <FlashList
                data={options}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.name}-${attribute.id}-${index}`}
                estimatedItemSize={ITEM_HEIGHT}
                extraData={{ currentSelection, isLoading }}
            />
        </YStack>
    );
}
