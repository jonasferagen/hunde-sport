import { AttributeTermDetails } from '@/models/Product/ProductAttribute';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { XStack, YStack } from 'tamagui';
import { AttributeOption } from './AttributeOption';

interface AttributeSelectorProps {
    options: AttributeTermDetails[];
    onSelect: (value: string | null) => void;
    selectedValue: string | null | undefined;
}

export const AttributeSelector = ({ options, onSelect, selectedValue }: AttributeSelectorProps) => {
    const renderItem = ({ item }: { item: AttributeTermDetails }) => {
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
        <XStack f={1} >
            <FlashList
                data={options}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.slug}-${index}`}
                estimatedItemSize={ITEM_HEIGHT}
                extraData={selectedValue}
                ItemSeparatorComponent={() => <YStack h="$2" />}
            />
        </XStack>
    );
};