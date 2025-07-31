import { ProductAttribute } from '@/models/ProductAttribute';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { YStack } from 'tamagui';
import { AttributeOptionTemp } from './AttributeOptionTemp';

interface AttributeSelectorProps {
    attribute: ProductAttribute;
    options: string[];
    selectedOptions: { [key: number]: string };
    onSelectOption: (attributeId: number, option: string) => void;
}

const ITEM_HEIGHT = 60; // Approximate item height

export const AttributeSelector = ({
    attribute,
    options,
    selectedOptions,
    onSelectOption,
}: AttributeSelectorProps) => {
    const renderItem = ({ item }: { item: string }) => {
        const isSelected = selectedOptions[attribute.id] === item;
        return (
            <AttributeOptionTemp
                option={item}
                attribute={attribute}
                selectOption={() => onSelectOption(attribute.id, item)}
                isSelected={isSelected}
            />
        );
    };

    return (
        <YStack flex={1}>
            <FlashList
                data={options}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item}-${attribute.id}-${index}`}
                estimatedItemSize={ITEM_HEIGHT}
                extraData={selectedOptions} // Ensures re-render when selection changes
            />
        </YStack>
    );
};