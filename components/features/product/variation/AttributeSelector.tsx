import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { YStack } from 'tamagui';
import { AttributeOption } from './AttributeOption';

interface AttributeSelectorProps {
    options: any[];
    onSelect: (value: string | null) => void;
    selectedValue: string | null | undefined;
}

export const AttributeSelector = ({ options, onSelect, selectedValue }: AttributeSelectorProps) => {
    const renderItem = ({ item }: { item: any }) => {
        const isSelected = selectedValue === item.slug;

        const handlePress = () => {
            onSelect(isSelected ? null : item.slug);
        };

        return (
            <AttributeOption
                option={item.name}
                selectOption={handlePress}
                isSelected={isSelected}
                isAvailable={item.isAvailable}
                price={item.displayPrice}
                inStock={item.inStock}
            />
        );
    };

    const ITEM_HEIGHT = 60; // Approximate item height
    return (
        <YStack>
            <FlashList
                data={options}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.slug}-${index}`}
                estimatedItemSize={ITEM_HEIGHT}
                extraData={selectedValue}
                ItemSeparatorComponent={() => <YStack h="$2" />}
            />
        </YStack>
    );
};