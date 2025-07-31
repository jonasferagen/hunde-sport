import { ProductAttribute } from '@/models/ProductAttribute';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { YStack } from 'tamagui';
import { AttributeOptionTemp } from './AttributeOptionTemp';

interface AttributeSelectorProps {
    attribute: ProductAttribute;
    selectedOption: string | undefined;
    onSelectOption: (optionLabel: string) => void;
}

const ITEM_HEIGHT = 60; // Approximate item height

export const AttributeSelector = ({
    attribute,
    selectedOption,
    onSelectOption,
}: AttributeSelectorProps) => {
    const renderItem = ({ item }: { item: string }) => {
        const term = attribute.terms.find((t) => t.name === item);
        const isSelected = !!(term && selectedOption === term.slug);

        return (
            <AttributeOptionTemp
                option={item}
                attribute={attribute}
                selectOption={() => onSelectOption(item)}
                isSelected={isSelected}
            />
        );
    };

    return (
        <YStack flex={1}>
            <FlashList
                data={attribute.terms.map((t) => t.name)}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item}-${attribute.id}-${index}`}
                estimatedItemSize={ITEM_HEIGHT}
                extraData={selectedOption}
            />
        </YStack>
    );
};